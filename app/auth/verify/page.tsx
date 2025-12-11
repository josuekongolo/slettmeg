import { HiMail } from "react-icons/hi";

export const dynamic = "force-dynamic";

export default function VerifyRequestPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900 mb-4">
            <HiMail className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
            Sjekk e-posten din
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Vi har sendt deg en påloggingslenke på e-post. Klikk på lenken for å
            logge inn på SlettMeg.
          </p>
          <div className="text-sm text-gray-500 dark:text-gray-500">
            Lenken utløper om 24 timer.
          </div>
        </div>
      </div>
    </div>
  );
}
