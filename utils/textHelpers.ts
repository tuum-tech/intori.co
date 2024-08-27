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

export function timeAgo(dateString: string): string {
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    let interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
        return `${interval} years ago`;
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
        return `${interval} months ago`;
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
        return `${interval} days ago`;
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
        return `${interval} hours ago`;
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
        return `${interval} minutes ago`;
    }
    return `${Math.floor(seconds)} seconds ago`;
}

export const replaceNewlinesWithSpaces = (input: string): string => {
  return input.replace(/\n/g, ' ');
}

export const removeEmojis = (input: string): string => {
  // This regex matches most emoji characters
  const emojiRegex = /[\uD83C-\uDBFF\uDC00-\uDFFF]+|[\u2600-\u26FF\u2700-\u27BF\u2B50-\u2B55]+/g;
  
  return input.replace(emojiRegex, '')
}

export const shortenNumber = (num: number): string => {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1) + 'm';
  }

  if (num >= 10_000) {
    return (num / 1_000).toFixed(1) + 'k';
  }

  return num.toString();
};

export const capitalizeFirstLetter = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
