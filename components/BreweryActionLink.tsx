import Link from 'next/link'
import React from 'react'

type ActionType = "call" | "website" | "map";

interface BreweryActionLinkProps {
  type: ActionType;
  value?: string | null;
  latitude?: string | null;
  longitude?: string | null;
}

const BreweryActionLink: React.FC<BreweryActionLinkProps> = ({
  type, value, latitude, longitude,
}) => {
  let href = "#";
  let disabled = false;
  let label = "";

  switch (type) {
    case "call":
      label = "Call";
      disabled = !value
      href = value ? `tel:${value}` : "#";
      break;

    case 'website':
      label = "Website";
      disabled = !value
      href = value ? value : "#";
      break;

    case 'map':
      label = "Map";
      disabled = !(latitude && longitude)
      href = !disabled ?
        `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}` :
        '#'
      break;
  }

  return (
    <Link
      href={href}
      target='_blank'
      className={`
            rounded-sm border px-4 py-1 w-full text-center 
            ${disabled && 'border-gray-300 text-gray-300 cursor-default'}
          `}
    >
      {label}
    </Link>
  )
}

export default BreweryActionLink

