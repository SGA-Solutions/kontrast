import Image from 'next/image';

export default function ScrollIcon() {
  return (
    <div className="fixed bottom-6 right-20 z-45 p-3">
      <Image
        src="/scroll-icon.webp"
        alt="Scroll icon"
        width={24}
        height={24}
        className="w-16 h-16 object-contain"
      />
    </div>
  );
}
