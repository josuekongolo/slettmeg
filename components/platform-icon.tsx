"use client";

import {
  SiFacebook,
  SiInstagram,
  SiTiktok,
  SiX,
  SiSnapchat,
  SiLinkedin,
  SiPinterest,
  SiTumblr,
  SiDiscord,
  SiTinder,
  SiBadoo,
  SiGoogle,
  SiGmail,
  SiYoutube,
  SiGoogledrive,
  SiSpotify,
  SiSoundcloud,
  SiNetflix,
  SiAmazon,
  SiTwitch,
  SiApple,
  SiDropbox,
  SiEvernote,
  SiNotion,
  SiSlack,
  SiZoom,
  SiSteam,
  SiPlaystation,
  SiEpicgames,
  SiRoblox,
  SiEbay,
  SiEtsy,
  SiPaypal,
  SiKlarna,
  SiStripe,
  SiWordpress,
  SiWix,
  SiSquarespace,
  SiShopify,
  SiMailchimp,
  SiCanva,
  SiAdobe,
  SiFigma,
  SiGithub,
  SiGitlab,
  SiBitbucket,
  SiStackoverflow,
  SiReddit,
  SiQuora,
  SiMedium,
  SiSubstack,
  SiPatreon,
  SiKickstarter,
  SiAirbnb,
  SiTripadvisor,
  SiUber,
  SiLyft,
  SiStrava,
  SiFitbit,
  SiWhatsapp,
  SiTelegram,
  SiSignal,
  SiMessenger,
  SiWechat,
  SiLine,
  SiViber,
  SiThreads,
  SiLastpass,
  SiBitwarden,
  SiProtonmail,
  SiTrello,
  SiAsana,
  SiJira,
  SiLinear,
  SiMiro,
  SiAirtable,
  SiZendesk,
  SiIntercom,
  SiHubspot,
  SiSalesforce,
  SiGrammarly,
  SiDuolingo,
  SiCoursera,
  SiUdemy,
} from "react-icons/si";
import {
  FaHeart,
  FaGamepad,
  FaGlobe,
  FaStore,
  FaMusic,
  FaVideo,
  FaCloud,
  FaEnvelope,
  FaUsers,
  FaShoppingCart,
  FaComments,
  FaBook,
  FaPlane,
  FaCar,
  FaRunning,
  FaLock,
  FaBriefcase,
  FaGraduationCap,
  FaNewspaper,
  FaCamera,
  FaTv,
  FaWallet,
  FaCode,
  FaWindows,
  FaXbox,
  FaMobileAlt,
} from "react-icons/fa";
import { cn } from "@/lib/utils";

interface PlatformIconProps {
  platformId: string;
  className?: string;
  size?: number;
}

// Map platform IDs to their icons and brand colors
const platformIcons: Record<string, { icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>; color: string }> = {
  // Social Media
  facebook: { icon: SiFacebook, color: "#1877F2" },
  instagram: { icon: SiInstagram, color: "#E4405F" },
  tiktok: { icon: SiTiktok, color: "#000000" },
  twitter: { icon: SiX, color: "#000000" },
  snapchat: { icon: SiSnapchat, color: "#FFFC00" },
  linkedin: { icon: SiLinkedin, color: "#0A66C2" },
  pinterest: { icon: SiPinterest, color: "#BD081C" },
  tumblr: { icon: SiTumblr, color: "#36465D" },
  discord: { icon: SiDiscord, color: "#5865F2" },
  reddit: { icon: SiReddit, color: "#FF4500" },
  threads: { icon: SiThreads, color: "#000000" },
  vsco: { icon: FaCamera, color: "#000000" },

  // Dating
  tinder: { icon: SiTinder, color: "#FF6B6B" },
  badoo: { icon: SiBadoo, color: "#783BF9" },
  bumble: { icon: FaHeart, color: "#FFC629" },
  match: { icon: FaHeart, color: "#E53935" },
  sukker: { icon: FaHeart, color: "#FF69B4" },
  moteplassen: { icon: FaHeart, color: "#E91E63" },
  "c-date": { icon: FaHeart, color: "#FF1744" },
  be2: { icon: FaHeart, color: "#9C27B0" },
  singles50: { icon: FaHeart, color: "#673AB7" },
  zoosk: { icon: FaHeart, color: "#00BCD4" },
  twoo: { icon: FaHeart, color: "#FF5722" },
  flirt: { icon: FaHeart, color: "#E91E63" },
  flirtfair: { icon: FaHeart, color: "#F06292" },
  gaysir: { icon: FaUsers, color: "#9C27B0" },

  // Google
  google: { icon: SiGoogle, color: "#4285F4" },
  gmail: { icon: SiGmail, color: "#EA4335" },
  youtube: { icon: SiYoutube, color: "#FF0000" },
  "google-drive": { icon: SiGoogledrive, color: "#4285F4" },

  // Streaming - Music
  spotify: { icon: SiSpotify, color: "#1DB954" },
  "apple-music": { icon: FaMusic, color: "#FA243C" },
  soundcloud: { icon: SiSoundcloud, color: "#FF5500" },
  tidal: { icon: FaMusic, color: "#000000" },
  deezer: { icon: FaMusic, color: "#FEAA2D" },

  // Streaming - Video
  netflix: { icon: SiNetflix, color: "#E50914" },
  "amazon-prime": { icon: SiAmazon, color: "#00A8E1" },
  amazon: { icon: SiAmazon, color: "#FF9900" },
  "hbo-max": { icon: FaTv, color: "#5822B4" },
  "disney-plus": { icon: FaTv, color: "#113CCF" },
  twitch: { icon: SiTwitch, color: "#9146FF" },
  viaplay: { icon: FaTv, color: "#FF0000" },
  "tv-2-play": { icon: FaTv, color: "#E4002B" },
  nrk: { icon: FaTv, color: "#0D3C8C" },

  // Cloud & Storage
  apple: { icon: SiApple, color: "#000000" },
  icloud: { icon: SiApple, color: "#3693F3" },
  microsoft: { icon: FaWindows, color: "#00A4EF" },
  dropbox: { icon: SiDropbox, color: "#0061FF" },
  "google-one": { icon: SiGoogle, color: "#4285F4" },
  onedrive: { icon: FaWindows, color: "#0078D4" },

  // Productivity
  evernote: { icon: SiEvernote, color: "#00A82D" },
  notion: { icon: SiNotion, color: "#000000" },
  slack: { icon: SiSlack, color: "#4A154B" },
  zoom: { icon: SiZoom, color: "#2D8CFF" },
  skype: { icon: FaVideo, color: "#00AFF0" },
  trello: { icon: SiTrello, color: "#0052CC" },
  asana: { icon: SiAsana, color: "#F06A6A" },
  jira: { icon: SiJira, color: "#0052CC" },
  linear: { icon: SiLinear, color: "#5E6AD2" },
  miro: { icon: SiMiro, color: "#FFD02F" },
  airtable: { icon: SiAirtable, color: "#18BFFF" },

  // Gaming
  steam: { icon: SiSteam, color: "#000000" },
  playstation: { icon: SiPlaystation, color: "#003791" },
  xbox: { icon: FaXbox, color: "#107C10" },
  "epic-games": { icon: SiEpicgames, color: "#000000" },
  roblox: { icon: SiRoblox, color: "#000000" },
  minecraft: { icon: FaGamepad, color: "#62B47A" },
  "nintendo-switch": { icon: FaGamepad, color: "#E60012" },
  "ea-games": { icon: FaGamepad, color: "#000000" },
  ubisoft: { icon: FaGamepad, color: "#000000" },
  blizzard: { icon: FaGamepad, color: "#00AEFF" },

  // Shopping
  ebay: { icon: SiEbay, color: "#E53238" },
  etsy: { icon: SiEtsy, color: "#F56400" },
  wish: { icon: FaShoppingCart, color: "#2FB7EC" },
  aliexpress: { icon: FaShoppingCart, color: "#E62E04" },
  finn: { icon: FaStore, color: "#06BEFB" },
  komplett: { icon: FaStore, color: "#000000" },
  elkjop: { icon: FaStore, color: "#1428A0" },
  zalando: { icon: FaShoppingCart, color: "#FF6900" },
  boozt: { icon: FaShoppingCart, color: "#000000" },

  // Payment
  paypal: { icon: SiPaypal, color: "#00457C" },
  klarna: { icon: SiKlarna, color: "#FFB3C7" },
  vipps: { icon: FaMobileAlt, color: "#FF5B24" },
  stripe: { icon: SiStripe, color: "#635BFF" },

  // Website Builders
  wordpress: { icon: SiWordpress, color: "#21759B" },
  wix: { icon: SiWix, color: "#0C6EFC" },
  squarespace: { icon: SiSquarespace, color: "#000000" },
  shopify: { icon: SiShopify, color: "#7AB55C" },

  // Marketing & Design
  mailchimp: { icon: SiMailchimp, color: "#FFE01B" },
  canva: { icon: SiCanva, color: "#00C4CC" },
  adobe: { icon: SiAdobe, color: "#FF0000" },
  figma: { icon: SiFigma, color: "#F24E1E" },

  // Developer
  github: { icon: SiGithub, color: "#181717" },
  gitlab: { icon: SiGitlab, color: "#FC6D26" },
  bitbucket: { icon: SiBitbucket, color: "#0052CC" },
  stackoverflow: { icon: SiStackoverflow, color: "#F58025" },

  // Forums & Knowledge
  quora: { icon: SiQuora, color: "#B92B27" },
  medium: { icon: SiMedium, color: "#000000" },
  substack: { icon: SiSubstack, color: "#FF6719" },

  // Crowdfunding
  patreon: { icon: SiPatreon, color: "#FF424D" },
  kickstarter: { icon: SiKickstarter, color: "#05CE78" },

  // Travel
  airbnb: { icon: SiAirbnb, color: "#FF5A5F" },
  booking: { icon: FaPlane, color: "#003580" },
  tripadvisor: { icon: SiTripadvisor, color: "#34E0A1" },
  hotels: { icon: FaPlane, color: "#D32F2F" },
  expedia: { icon: FaPlane, color: "#00355F" },

  // Transport
  uber: { icon: SiUber, color: "#000000" },
  lyft: { icon: SiLyft, color: "#FF00BF" },
  bolt: { icon: FaCar, color: "#34D186" },

  // Fitness
  strava: { icon: SiStrava, color: "#FC4C02" },
  fitbit: { icon: SiFitbit, color: "#00B0B9" },
  myfitnesspal: { icon: FaRunning, color: "#0093D1" },

  // Messaging
  whatsapp: { icon: SiWhatsapp, color: "#25D366" },
  telegram: { icon: SiTelegram, color: "#26A5E4" },
  signal: { icon: SiSignal, color: "#3A76F0" },
  messenger: { icon: SiMessenger, color: "#00B2FF" },
  wechat: { icon: SiWechat, color: "#07C160" },
  line: { icon: SiLine, color: "#00C300" },
  viber: { icon: SiViber, color: "#7360F2" },
  kik: { icon: FaComments, color: "#82BC23" },
  meetme: { icon: FaUsers, color: "#E91E63" },

  // Security
  lastpass: { icon: SiLastpass, color: "#D32D27" },
  "1password": { icon: FaLock, color: "#0094F5" },
  bitwarden: { icon: SiBitwarden, color: "#175DDC" },

  // Email
  protonmail: { icon: SiProtonmail, color: "#6D4AFF" },
  outlook: { icon: FaEnvelope, color: "#0078D4" },

  // Business
  zendesk: { icon: SiZendesk, color: "#03363D" },
  intercom: { icon: SiIntercom, color: "#6AFDEF" },
  hubspot: { icon: SiHubspot, color: "#FF7A59" },
  salesforce: { icon: SiSalesforce, color: "#00A1E0" },

  // Education
  grammarly: { icon: SiGrammarly, color: "#15C39A" },
  duolingo: { icon: SiDuolingo, color: "#58CC02" },
  coursera: { icon: SiCoursera, color: "#0056D2" },
  udemy: { icon: SiUdemy, color: "#A435F0" },

  // Norwegian specific
  disqus: { icon: FaComments, color: "#2E9FFF" },
  hemmelig: { icon: FaLock, color: "#9C27B0" },
  gulesider: { icon: FaBook, color: "#FFCC00" },
  telefonkatalogen: { icon: FaBook, color: "#FF9800" },
  "1881": { icon: FaBook, color: "#E53935" },
  proff: { icon: FaBriefcase, color: "#1976D2" },
  purehelp: { icon: FaBriefcase, color: "#4CAF50" },
};

// Category fallback icons
const categoryFallbacks: Record<string, { icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>; color: string }> = {
  "Sosiale medier": { icon: FaUsers, color: "#1976D2" },
  "Dating": { icon: FaHeart, color: "#E91E63" },
  "Streaming": { icon: FaVideo, color: "#FF5722" },
  "Gaming": { icon: FaGamepad, color: "#9C27B0" },
  "Shopping": { icon: FaShoppingCart, color: "#4CAF50" },
  "Reise": { icon: FaPlane, color: "#00BCD4" },
  "Transport": { icon: FaCar, color: "#607D8B" },
  "Trening": { icon: FaRunning, color: "#FF9800" },
  "Produktivitet": { icon: FaBriefcase, color: "#3F51B5" },
  "Finans": { icon: FaWallet, color: "#009688" },
  "Utvikling": { icon: FaCode, color: "#424242" },
  "Utdanning": { icon: FaGraduationCap, color: "#673AB7" },
  "Nyheter": { icon: FaNewspaper, color: "#795548" },
  "Kommunikasjon": { icon: FaComments, color: "#03A9F4" },
  "Sky og lagring": { icon: FaCloud, color: "#2196F3" },
  "E-post": { icon: FaEnvelope, color: "#F44336" },
  "Personvern": { icon: FaLock, color: "#607D8B" },
};

export function PlatformIcon({ platformId, className, size = 24 }: PlatformIconProps) {
  const iconData = platformIcons[platformId];

  if (iconData) {
    const Icon = iconData.icon;
    return (
      <Icon
        size={size}
        className={className}
        style={{ color: iconData.color }}
      />
    );
  }

  // Return default icon
  return <FaGlobe size={size} className={cn("text-muted-foreground", className)} />;
}

export function getPlatformColor(platformId: string): string {
  return platformIcons[platformId]?.color || "#6B7280";
}

export function getCategoryIcon(category: string) {
  return categoryFallbacks[category] || { icon: FaGlobe, color: "#6B7280" };
}
