export const Navbar = ({ showLogOut, handleSignOut }) => {
  return (
    <div
      className="fixed w-full top-0 py-3 shadow-md bg-indigo-700"
      style={{ zIndex: "99999" }}
    >
      <div className="flex items-center justify-between w-full max-w-[1280px] m-auto">
        <div>videocfc</div>
        <div className="flex items-ceneter gap-4">
          <a href="/">
            <button
              onClick={handleSignOut}
              className="rounded-full bg-indigo-700 h-[40px] flex items-center justify-center text-white"
            >
              Home
            </button>
          </a>
          <a href="meeting">
            <button
              onClick={handleSignOut}
              className="rounded-full bg-indigo-700 h-[40px] flex items-center justify-center text-white"
            >
              Meeting
            </button>
          </a>
          <a href="/recordings">
            <button
              onClick={handleSignOut}
              className="rounded-full bg-indigo-700 h-[40px] flex items-center justify-center text-white"
            >
              Recordings
            </button>
          </a>
          {showLogOut && (
            <div className="">
              <button
                onClick={handleSignOut}
                className="rounded-full bg-red-700 h-[40px] flex items-center justify-center"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
