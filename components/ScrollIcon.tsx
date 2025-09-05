import Image from 'next/image';

export default function ScrollIcon() {
  return (
    <div className="fixed bottom-6 right-6 z-50 p-3">
      <Image
        src="/scroll-icon.webp"
        alt="Scroll icon"
        width={24}
        height={24}
        className="w-24 h-24 object-contain"
      />
    </div>
  );
}
