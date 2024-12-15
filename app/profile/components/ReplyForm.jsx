import {supabase} from './../../../lib/initSupabase';
import React from 'react';

function ReplyForm({ profile, message, sender, HandleReplied }) {

  const HandleSubmitForm = async (event) => {
    event.preventDefault();  // Prevent form default submission
    const ReplyMessage = event.target.replyMessage.value;

    // Perform Supabase insert operation
    const { data, error } = await supabase.from('CarMessages').insert({
      message: ReplyMessage,  
      sender: sender?.emailAddresses[0]?.emailAddress,
      receiver: profile?.emailAddresses[0]?.emailAddress,
      CarId: message?.CarId,
      car_owner: sender?.emailAddresses[0]?.emailAddress
    });

    if (error) {
      console.error("Error sending reply:", error.message);
    } else {
      HandleReplied();  // Callback function after a successful reply
    }
  };

  return (
    <div className="w-full h-full bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-10 text-gray-700">Reply to {profile?.username}</h2>
      <form method="POST" className="space-y-6" onSubmit={HandleSubmitForm}>
        {/* Message Text Field */}
        <div>
          <label htmlFor="replyMessage" className="block text-sm font-medium text-gray-700">
            Your Message
          </label>
          <div className="mt-1">
            <textarea
              id="replyMessage"
              name="replyMessage"
              rows="6"
              className="block w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700 text-sm"
              placeholder="Type your reply here..."
              required
            ></textarea>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Send Reply
          </button>
        </div>
      </form>
    </div>
  );
}

export default ReplyForm;
