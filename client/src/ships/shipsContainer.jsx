
function ShipsContainer() {
  return (
    <div className="grid gap-0.5 grid-cols-4 grid-rows-5 xl:h-[calc(65%/2] lg:h-1/4 h-1/6 w-[calc(41px*4)] border-4 border-amber-200 absolute right-0 top-1/2 -translate-y-1/2">
        <div className="col-start-1 col-span-1 row-span-5 border-2 border-white" draggable>5</div>
        <div className="col-start-2 col-span-1 row-span-4 border-2 border-white" draggable>4</div>
        <div className="col-start-3 col-span-1 row-span-3 border-2 border-white" draggable>3</div>
        <div className="col-start-4 col-span-1 row-span-2 border-2 border-white" draggable>2</div>
    </div>
  )
}

export default ShipsContainer