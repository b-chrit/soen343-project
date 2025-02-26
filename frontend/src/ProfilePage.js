import { ChevronLeft } from "lucide-react";

export default function ProfilePage({ onBack }) {
  return (
    <div className="min-h-screen bg-white flex flex-col relative">

      {/* MAIN CONTENT */}
      <div className="px-16 py-8 flex flex-col">
        {/* BACK BUTTON & TITLE */}
        <div className="flex items-center space-x-4 mb-8">
          <button onClick={onBack} className="p-2">
            <ChevronLeft className="w-7 h-7" />
          </button>
          <h1 className="text-4xl font-bold uppercase">My Profile</h1>
        </div>

        {/* PROFILE CARD */}
        <div className="border border-black rounded-lg p-12 w-[600px] mx-auto">
          {/* Avatar (Top Left) */}
          <div className="flex items-start">
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500 text-4xl">👤</span>
            </div>
          </div>

          {/* Form Fields (Two per Row) */}
          <div className="mt-6 grid grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className="text-sm text-gray-700">NAME</label>
              <input
                type="text"
                value="JANE DOE"
                className="border border-gray-400 py-3 px-4 rounded-md w-full text-lg"
                readOnly
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm text-gray-700">EMAIL</label>
              <input
                type="text"
                value="JANE.DOE@GMAIL.COM"
                className="border border-gray-400 py-3 px-4 rounded-md w-full text-lg"
                readOnly
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm text-gray-700">PHONE NUMBER</label>
              <input
                type="text"
                value="(123) 456-7890"
                className="border border-gray-400 py-3 px-4 rounded-md w-full text-lg"
                readOnly
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm text-gray-700">ROLE</label>
              <input
                type="text"
                value="ATTENDEE"
                className="border border-gray-400 py-3 px-4 rounded-md w-full text-lg"
                readOnly
              />
            </div>
          </div>

          {/* Edit Button (Bottom Right, Perfect Styling) */}
          <div className="flex justify-end mt-6">
            <button className="py-2 px-6 bg-black text-white font-medium border border-black transition hover:bg-white hover:text-black">
              EDIT
            </button>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="text-sm text-gray-600 p-4 pl-6 absolute bottom-0 left-0">
        LOGGED IN AS: ATTENDEE
      </footer>
    </div>
  );
}
