/**
 * Web Share API Utility
 * Handles social media sharing with fallback
 */

/**
 * Share using Web Share API or fallback to social URLs
 */
export const shareContent = async ({ title, text, url, platform = 'native' }) => {
  const fullUrl = url || window.location.href;
  const shareData = {
    title,
    text,
    url: fullUrl,
  };

  // Try native Web Share API first (if platform is native)
  if (platform === 'native' && navigator.share) {
    try {
      await navigator.share(shareData);
      return { success: true };
    } catch (error) {
      // User cancelled or error occurred
      if (error.name !== 'AbortError') {
        console.error('Share error:', error);
      }
      return { success: false, error };
    }
  }

  // Fallback to platform-specific URLs
  const encodedUrl = encodeURIComponent(fullUrl);
  const encodedText = encodeURIComponent(text || title);

  let shareUrl;
  
  switch (platform) {
    case 'facebook':
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`;
      break;
    case 'twitter':
      shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`;
      break;
    case 'whatsapp':
      shareUrl = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
      break;
    case 'linkedin':
      shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
      break;
    default:
      // Copy to clipboard as fallback
      try {
        await navigator.clipboard.writeText(fullUrl);
        return { success: true, copied: true };
      } catch (error) {
        console.error('Clipboard error:', error);
        return { success: false, error };
      }
  }

  // Open share URL in new window
  if (shareUrl) {
    window.open(shareUrl, '_blank', 'width=600,height=400');
    return { success: true };
  }

  return { success: false };
};

/**
 * Copy link to clipboard
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.warn('Clipboard API unavailable, using legacy fallback.', error);
    // Fallback method
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch (err) {
      document.body.removeChild(textArea);
      console.error('Clipboard error:', err);
      return false;
    }
  }
};

