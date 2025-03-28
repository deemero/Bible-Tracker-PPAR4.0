export default function PageWrapper({ children }) {
    return (
      <div className="w-full flex justify-center px-4">
        <div className="w-full max-w-md py-6">{children}</div>
      </div>
    );
  }
  