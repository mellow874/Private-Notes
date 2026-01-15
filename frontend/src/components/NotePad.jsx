import { ChevronDownIcon } from '@heroicons/react/16/solid';
import { useRef } from 'react'

// NotePad component displays a form for writing notes, including a category and content
export default function NotePad({ value, onChange, ...props }) {
    //directly manipulate the DOM element (textarea)
    const ref = useRef();

    //adjusts the height of the textarea as content grows
    const handleInput = (e) => {
        // Reset the height to auto so scrollHeight recalculates correctly
        ref.current.style.height = "auto";
        // Set the height to the scrollHeight so all content fits without scrolling
        ref.current.style.height = `${ref.current.scrollHeight}px`;

        // Call the parent's onChange if provided to update state
        onChange && onChange(e);
    };

    return (
        <div className='flex h-screen'>
            {/* Outer container*/}
            <div className="flex-1 w-full flex justify-center bg-black -100 px-6 py-24 sm:py-32 lg:px-8">
                {/* Inner container*/}
                <div className='w-175 h-full contact bg-white p-8'>

                    {/* Form element */}
                    <form action="#" method="POST" className="mx-auto max-w-xl sm:mt-20">
                        {/* Grid layout: single column by default, two columns on small screens */}
                        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                            
                            {/* Category input spans 2 columns on small screens */}
                            <div className="sm:col-span-2">
                                {/* Label for the category input */}
                                <label className="block text-sm/6 font-semibold text-label text-Scolor">
                                    Category
                                </label>
                                <div className="mt-2.5">
                                    <input
                                        id="category"
                                        name="category"
                                        type="text"
                                        placeholder="School"
                                        className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                                    />
                                </div>
                            </div>

                            {/* Note content textarea spans 2 columns */}
                            <div className="mt-2.5">
                                <textarea
                                    ref={ref} //  manipulate height
                                    value={value} // controlled value from parent state
                                    onChange={handleInput} // update value and resize
                                    onInput={handleInput} // resize on input events
                                    {...props} // allow additional props like placeholder, className
                                    className="w-full rounded border p-3 resize-none overflow-hidden"
                                    style={{ minHeight: 48 }} // set minimum height
                                />
                            </div>
                        </div>

                        {/* Submit button*/}
                        <div className="mt-10">
                            <button
                                type="submit"
                                className="block w-full bg-black px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Save Note
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
