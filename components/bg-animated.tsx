function BgAnimated() {
  return (
    <div className="absolute top-0 left-0 w-full h-full bg-gray-950 -z-1">
      <video
        src="/assets/bg/bg-animated-1_LOOP.mp4"
        className="w-full h-full object-cover blur-3xl opacity-80"
        autoPlay
        loop
        muted
      />
    </div>
  );
}

export default BgAnimated;
