const CenteredMessage = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center justify-center h-screen w-full">
    {children}
  </div>
);

export const LoadingSpinner = () => (
  <CenteredMessage>
    <div className="flex flex-col items-center">
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-lg text-gray-700">Chargement des services...</p>
    </div>
  </CenteredMessage>
);

export const Message = ({ text, colorClass = "text-gray-500" }: { text: string; colorClass?: string }) => (
  <CenteredMessage>
    <p className={colorClass}>{text}</p>
  </CenteredMessage>
);