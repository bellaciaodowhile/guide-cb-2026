import React from 'react';

interface CountryFlagProps {
  code: string;
  size?: number;
  className?: string;
}

const CountryFlag: React.FC<CountryFlagProps> = ({ code, size = 20, className = '' }) => {
  if (!code) return null;

  const upperCode = code.toUpperCase();

  return (
    <img
      src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${upperCode}.svg`}
      alt={upperCode}
      style={{
        width: size * 1.5,
        height: size,
        borderRadius: 2,
        objectFit: 'cover',
        display: 'inline-block',
        verticalAlign: 'middle',
      }}
      className={className}
      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
    />
  );
};

export default CountryFlag;
