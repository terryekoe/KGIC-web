export interface ShareData {
  title: string;
  text?: string;
  url: string;
}

export const canUseWebShare = (): boolean => {
  return typeof navigator !== 'undefined' && 'share' in navigator;
};

export const shareContent = async (data: ShareData): Promise<boolean> => {
  if (canUseWebShare()) {
    try {
      await navigator.share(data);
      return true;
    } catch (error) {
      // User cancelled or error occurred
      console.log('Web Share cancelled or failed:', error);
      return false;
    }
  }
  return false;
};

export const generateShareUrl = (prayerId: string | number): string => {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/prayers/${prayerId}`;
  }
  return `https://kgic.org/prayers/${prayerId}`;
};

export const generateShareText = (title: string): string => {
  return `🙏 ${title} - A prayer from KGIC`;
};