export default function LegacySelect({ items, ref, name }) {
    return (
        <div>
            <select
                ref={ref}
                id={name}
                name={name}
                className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                defaultValue=""
            >
                <option value=''>Choose a person...</option>
                {items.length && items.map((item) => (
                    <option key={item.uid} value={item.uid}>{item.name}</option>
                ))}
            </select>
        </div>
    )
}