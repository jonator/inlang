import { useState } from "react";
import { DefaultLayout } from "../DefaultLayout.js";
import { Navigation } from "../documentation/Navigation.js";
export function Page() {
	const [count, setCount] = useState(0);
	return (
		<DefaultLayout>
			{/* <h1>{count}</h1> */}
			{/* <button
				className="button button-fill-primary"
				onClick={() => setCount(count + 1)}
			>
				Increment
			</button> */}
		</DefaultLayout>
	);
}
