import { useEffect, useRef } from "react"
import { Grid3D } from "./Effect";

const items = [
    "1.jpg",
    "2.jpg",    
    "3.jpg",
    "4.jpg",
    "5.jpg",
    "6.jpg",
    "7.jpg",
    "8.jpg",
    "9.jpg"
]
export default function GridEffect() {
    const gridRef = useRef<HTMLDivElement>(null);
    let increment = 0;
    useEffect(() => {
       if(increment==0){
        new Grid3D( gridRef.current as HTMLElement, {} );
        increment++;
       }
    }, [])
    return (
        <>
        <style>
            {`
            body {
	position: relative;
}

.noscroll {
	overflow: hidden;
}`}
        </style>
            <div className="container1732916007947 ">
			
		
			<section className="grid3d1732916007947 vertical1732916007947" ref={gridRef} id="grid3d">
				<div className="grid-wrap1732916007947">
					<div className="grid1732916007947">
						{items.map( ( item, index ) => <figure key={index}><img src={`img/${item}`} alt={`img${item}`}/></figure> )}
						
					</div>
				</div>
				<div className="content1732916007947">
                    {items.map((item, index)=>(
                        <div key={index} id={`indexItem${index}`} >
						<div className="dummy-img1732916007947">
                            <img src={`img/${item}`} alt={`img${item}`}/>
                        </div>
						<p className="dummy-text1732916007947">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Inventore sunt nesciunt facilis aliquid distinctio voluptate non vel recusandae est, beatae dicta quae atque earum ab, porro voluptatem commodi, officia repellendus.</p>
						<p className="dummy-text1732916007947">The only people for me are the mad ones, the ones who are mad to live, mad to talk, mad to be saved, desirous of everything at the same time, the ones who never yawn or say a commonplace thing, but burn, burn, burn like fabulous yellow roman candles exploding like spiders across the stars.</p>
					</div>
                    ))}
				
					<span className="loading1732916007947"></span>
					<span className="icon1732916007947 close-content1732916007947 text-red-600">fermer</span>
				</div>
			</section>
			
			
		</div>
        </>
    )
}