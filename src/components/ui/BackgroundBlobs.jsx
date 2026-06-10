export function BackgroundBlobs() {
  return (
    <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-400 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-pulse-slow"></div>
      <div
        className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-400 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-pulse-slow"
        style={{ animationDelay: "1s" }}
      ></div>
    </div>
  );
}
