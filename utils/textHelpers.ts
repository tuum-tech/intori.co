export const camelCaseToTitleCase = (input: string): string => {
    if (!input) {
      return ''
    }

    const spaced = input.replace(/([A-Z])/g, ' $1').trim();

    const words = spaced.split(' ').map(word => {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase().trim()
    });

    return words.join(' ')
}
