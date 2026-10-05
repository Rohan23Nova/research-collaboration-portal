export default function Skeleton({ className = '' }) {
  return (
    <div 
      aria-hidden="true"
      className={`animate-pulse motion-reduce:animate-none rounded-md bg-border-muted/50 dark:bg-[#3D3934]/70 ${className}`} 
    />
  );
}