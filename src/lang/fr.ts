export const fr = {
  processCanvas: "Traiter les fichiers Canvas",
  processCanvasDesc: "Traiter les images dans Obsidian Canvas (.canvas)",
  urlExcludeRegexps: "Regex d'exclusion d'URLs",
  urlExcludeRegexpsDesc: "Un par ligne : expressions régulières pour exclure des URLs lors du téléchargement. Exemples :\n^https://example\\.com/.*\n.*ads\\..*",
  useMarkdownAngle: "Utiliser le format Markdown avec chevrons ![](<lien>)",
  useMarkdownAngleDesc: "Générer des liens au format ![](<lien>) sans encodage URI",
  downloadUnknown: "Télécharger les types de fichiers inconnus",
  downloadUnknownDesc: "Télécharger les fichiers inconnus et les enregistrer avec l'extension .unknown",
  fileNameTemplate: "Modèle de nom de fichier",
  fileNameTemplateDesc: "Modèle pour les nouveaux fichiers joints. Variables : ${md5}, ${md5:N}, ${originalname}, ${notename}, ${date}, ${unique}. Par défaut : ${md5}_MD5. Exemples : ${originalname}, ${notename}-${originalname}, ${date}-${md5:8}. Pour les sous-dossiers, utiliser le paramètre 'Dossier pour enregistrer les nouveaux fichiers joints'.",
  fileNameTemplateError: "Le modèle de nom de fichier ne doit pas contenir de séparateurs de chemin. Pour les sous-dossiers, utiliser le paramètre 'Dossier pour enregistrer les nouveaux fichiers joints'."
};
export default fr;
