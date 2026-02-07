import { useState } from 'react';

interface LogoProps {
  className?: string;
  alt?: string;
}

const Logo = ({ className = 'h-10 w-auto', alt = 'Company Logo' }: LogoProps) => {
  const [imageError, setImageError] = useState(false);
  
  // Try local logo first, fallback to S3 URL
  const localLogoUrl = '/logo.webp';
  const s3LogoUrl = 'https://newoaks.s3.us-west-1.amazonaws.com/AutoDev/59275/ca742850-fe9e-4a16-9efc-a791f65af5c7.webp';
  
  return (
    <img
      src={imageError ? s3LogoUrl : localLogoUrl}
      alt={alt}
      className={className}
      onError={() => setImageError(true)}
      loading="lazy"
    />
  );
};

export default Logo;