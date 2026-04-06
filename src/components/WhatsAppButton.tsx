import { useLocation } from "react-router-dom";

const WhatsAppButton = ({ hidden }: { hidden?: boolean }) => {
  const { pathname } = useLocation();

  // Hide on admin and login pages
  if (pathname.startsWith("/admin") || pathname.startsWith("/login") || hidden) {
    return null;
  }

  return (
    <a
      href="https://wa.me/8801752171478"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-[60px] h-[60px] rounded-full shadow-xl hover:scale-110 transition-transform duration-200"
      style={{
        background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)",
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 39.045 39.044"
        className="w-8 h-8"
        fill="white"
      >
        <path d="M19.527 0C8.748 0 0 8.747 0 19.527c0 3.443.904 6.817 2.619 9.794L.043 38.58a.737.737 0 00.906.906l9.26-2.577a19.42 19.42 0 009.318 2.375c10.78 0 19.527-8.748 19.527-19.527S30.307 0 19.527 0zm0 35.58a17.97 17.97 0 01-8.764-2.28.736.736 0 00-.569-.077l-7.09 1.972 1.972-7.09a.736.736 0 00-.077-.57A17.97 17.97 0 011.474 19.528C1.474 9.56 9.56 1.474 19.527 1.474S37.58 9.56 37.58 19.527 29.494 35.58 19.527 35.58z" />
        <path d="M29.088 23.938l-3.69-1.682a1.474 1.474 0 00-1.4.144l-1.36.97a.737.737 0 01-.785.058c-1.56-.807-4.89-4.137-5.698-5.697a.737.737 0 01.058-.785l.97-1.36a1.474 1.474 0 00.145-1.4L15.644 10.5a1.474 1.474 0 00-1.837-.846c-1.34.437-2.533 1.283-3.142 2.532-.934 1.912-.388 4.725 1.622 8.348 2.012 3.622 4.053 5.73 6.07 6.89 1.312.754 3.07 1.272 4.798.58 1.127-.451 2.12-1.44 2.72-2.675a1.474 1.474 0 00-.787-1.39z" />
      </svg>
    </a>
  );
};

export default WhatsAppButton;
