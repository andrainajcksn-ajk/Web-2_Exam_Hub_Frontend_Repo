export function isValidQuestionDraft({ statement, points, choices }) {
  if (!statement || !statement.trim()) return 'L\'énoncé est obligatoire.'
  if (!points || Number(points) <= 0) return 'Le nombre de points doit être positif.'
  if (!choices || choices.length < 2 || choices.length > 6) {
    return 'Une question doit avoir entre 2 et 6 choix.'
  }
  if (choices.some((c) => !c.text || !c.text.trim())) {
    return 'Tous les choix doivent avoir un texte.'
  }
  const correctCount = choices.filter((c) => c.isCorrect).length
  if (correctCount !== 1) {
    return 'Exactement un choix doit être marqué comme correct.'
  }
  return null
}