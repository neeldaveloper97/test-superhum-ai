import { signInWithGoogle } from "../api";

export const Auth = () => {
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <button onClick={signInWithGoogle}>Signin With Google</button>
    </div>
  );
};
