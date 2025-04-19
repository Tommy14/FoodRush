import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SignUpPage from "./Signup";
import LoginPage from "./Login";

export default function AuthPage() {
  const [formType, setFormType] = useState("signup");

  return (
    <div className="flex flex-col items-center justify-center px-6 py-10 min-h-screen bg-gray-100">
      <AnimatePresence mode="wait">
        <motion.div
          key={formType}
          initial={{ rotateY: 90, opacity: 0 }}
          animate={{ rotateY: 0, opacity: 1 }}
          exit={{ rotateY: -90, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full"
        >
          {formType === "signup" ? (
            <>
            <LoginPage />
            <p className="text-sm text-center text-gray-600 mt-4">
              Don’t have an account?{" "}
              <span
                onClick={() => setFormType("signup")}
                className="text-green-600 font-semibold cursor-pointer"
              >
                Sign up
              </span>
            </p>
          </>
          ) : (
            <>
            <SignUpPage onSuccessSwitchToLogin={() => setFormType("login")} />
            <p className="text-sm text-center text-gray-600 mt-4">
              Already have an account?{" "}
              <span
                onClick={() => setFormType("login")}
                className="text-green-600 font-semibold cursor-pointer"
              >
                Log in
              </span>
            </p>
          </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
