package com.example.springdatarest.service;

import com.example.springdatarest.modele.Voiture;
import com.example.springdatarest.repository.VoitureRepo;
import org.springframework.ai.ollama.OllamaChatModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class VoitureAssistant {

    @Autowired
    private OllamaChatModel chatModel;

    @Autowired
    private VoitureRepo voitureRepo;

    // Historique de conversation (en mémoire, réinitialisé au redémarrage)
    private final List<String> historiqueConversation = new ArrayList<>();

    public String poserQuestion(String question) {
        List<Voiture> voitures = (List<Voiture>) voitureRepo.findAll();

        // ── 1. Statistiques pré-calculées ──────────────────────────────────
        OptionalDouble prixMoyenOpt = voitures.stream()
                .mapToDouble(Voiture::getPrix).average();
        int prixMin = voitures.stream().mapToInt(Voiture::getPrix).min().orElse(0);
        int prixMax = voitures.stream().mapToInt(Voiture::getPrix).max().orElse(0);
        double prixMoyen = prixMoyenOpt.orElse(0);
        int totalVoitures = voitures.size();

        // Voiture la moins / la plus chère
        Voiture voitureLaMoinsChere = voitures.stream()
                .min(Comparator.comparingInt(Voiture::getPrix)).orElse(null);
        Voiture voitureLaPlusChere = voitures.stream()
                .max(Comparator.comparingInt(Voiture::getPrix)).orElse(null);

        // Regroupement par marque
        Map<String, Long> parMarque = voitures.stream()
                .collect(Collectors.groupingBy(Voiture::getMarque, Collectors.counting()));

        // Regroupement par tranche de prix
        long moinsDe100k = voitures.stream().filter(v -> v.getPrix() < 100000).count();
        long entre100kEt150k = voitures.stream()
                .filter(v -> v.getPrix() >= 100000 && v.getPrix() <= 150000).count();
        long plusDe150k = voitures.stream().filter(v -> v.getPrix() > 150000).count();

        // ── 2. Construction du contexte catalogue ──────────────────────────
        StringBuilder catalogue = new StringBuilder();
        catalogue.append("=== CATALOGUE DU MAGASIN ===\n\n");

        for (Voiture v : voitures) {
            String proprietaireNom = (v.getProprietaire() != null)
                    ? v.getProprietaire().getPrenom() + " " + v.getProprietaire().getNom()
                    : "Non renseigné";
            int anneeActuelle = java.time.Year.now().getValue();
            int age = anneeActuelle - v.getAnnee();

            catalogue.append(String.format(
                    "• %s %s (%d) | Couleur : %s | Immat : %s | Prix : %,d€ | Âge : %d ans | Propriétaire : %s\n",
                    v.getMarque(), v.getModele(), v.getAnnee(),
                    v.getCouleur(), v.getImmatricule(),
                    v.getPrix(), age, proprietaireNom
            ));
        }

        catalogue.append("\n=== STATISTIQUES ===\n");
        catalogue.append(String.format("• Nombre total de voitures : %d\n", totalVoitures));
        catalogue.append(String.format("• Prix moyen : %,.0f€\n", prixMoyen));
        catalogue.append(String.format("• Prix minimum : %,d€\n", prixMin));
        catalogue.append(String.format("• Prix maximum : %,d€\n", prixMax));
        catalogue.append(String.format("• Voiture la moins chère : %s %s à %,d€\n",
                voitureLaMoinsChere != null ? voitureLaMoinsChere.getMarque() : "N/A",
                voitureLaMoinsChere != null ? voitureLaMoinsChere.getModele() : "",
                voitureLaMoinsChere != null ? voitureLaMoinsChere.getPrix() : 0));
        catalogue.append(String.format("• Voiture la plus chère : %s %s à %,d€\n",
                voitureLaPlusChere != null ? voitureLaPlusChere.getMarque() : "N/A",
                voitureLaPlusChere != null ? voitureLaPlusChere.getModele() : "",
                voitureLaPlusChere != null ? voitureLaPlusChere.getPrix() : 0));
        catalogue.append("\nRépartition par marque : ");
        parMarque.forEach((marque, count) ->
                catalogue.append(String.format("%s (%d), ", marque, count)));
        catalogue.append(String.format(
                "\nTranches de prix : < 100K€ : %d voiture(s) | 100K-150K€ : %d | > 150K€ : %d\n",
                moinsDe100k, entre100kEt150k, plusDe150k));

        // ── 3. Prompt système expert ────────────────────────────────────────
        String systemPrompt = """
                Tu es "AutoExpert", un conseiller commercial haut de gamme et analyste automobile pour notre magasin de voitures.
                Tu possèdes une expertise en finance automobile, marketing, et analyse de marché.

                TES CAPACITÉS :
                - Analyser et comparer les véhicules du catalogue avec précision
                - Détecter des anomalies de prix (ex : prix trop élevé/bas par rapport au marché)
                - Recommander la meilleure voiture selon un budget ou des besoins spécifiques
                - Calculer et interpréter des statistiques (moyenne, écarts, tendances)
                - Générer des descriptions marketing professionnelles et attractives
                - Expliquer les avantages et inconvénients de chaque véhicule

                TES RÈGLES :
                - Tu réponds TOUJOURS en français, avec un ton professionnel et chaleureux
                - Tu bases UNIQUEMENT tes réponses sur les données du catalogue fourni
                - Tes réponses sont structurées, claires, et vont à l'essentiel (2-5 phrases max sauf si on te demande plus)
                - Si une question sort du domaine automobile, tu replies poliment que tu es spécialisé dans les véhicules
                - Tu utilises les statistiques pré-calculées quand c'est pertinent
                - Pour les recommandations budget, tu proposes toujours la meilleure option et expliques pourquoi
                """;

        // ── 4. Historique de conversation (5 derniers échanges) ─────────────
        String historiqueTexte = "";
        if (!historiqueConversation.isEmpty()) {
            int debut = Math.max(0, historiqueConversation.size() - 10); // 5 Q+R = 10 entrées
            List<String> recent = historiqueConversation.subList(debut, historiqueConversation.size());
            historiqueTexte = "\n=== HISTORIQUE RÉCENT ===\n" + String.join("\n", recent) + "\n";
        }

        // ── 5. Assemblage du prompt final ───────────────────────────────────
        String promptFinal = systemPrompt
                + "\n\n" + catalogue
                + historiqueTexte
                + "\n=== QUESTION DU CLIENT ===\n"
                + question
                + "\n\nRéponds en tant qu'AutoExpert :";

        // ── 6. Appel au modèle ──────────────────────────────────────────────
        String reponse = chatModel.call(promptFinal);

        // ── 7. Sauvegarde dans l'historique ────────────────────────────────
        historiqueConversation.add("Client : " + question);
        historiqueConversation.add("AutoExpert : " + reponse);

        // Limite l'historique à 20 entrées (10 échanges)
        if (historiqueConversation.size() > 20) {
            historiqueConversation.subList(0, historiqueConversation.size() - 20).clear();
        }

        return reponse;
    }

    // Endpoint optionnel pour réinitialiser la conversation
    public void reinitialiserHistorique() {
        historiqueConversation.clear();
    }
}