const AppLoader = () => (
  <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 bg-background">
    <img
      src="/JYM%20LOGO.png"
      alt="FitBody"
      className="h-28 w-auto object-contain animate-pulse"
    />
    <div className="relative h-10 w-10">
      <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
      <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-primary" />
    </div>
  </div>
);

export default AppLoader;
