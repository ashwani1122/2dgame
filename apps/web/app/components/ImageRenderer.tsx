
const ImageRenderer = ({ data }:{data:any}) => {
    const containerStyle: React.CSSProperties = {
        width: '1000px',
        height: '1000px',
        border: '1px solid #ccc',
        background: '#f5f5f5',
    };
    return (
        <div style={containerStyle}>
        {data.elements.map((item:any , key:string) => {
            const { imageUrl } = item.element;
            const { x, y } = item;
            return (
            <img 
                key={item.id}
                src={imageUrl}
                width={200}
                height={100}
                alt=""
                style={{
                top: y,
                left: x,
                position: 'relative',
                display:"flex",
                flexDirection:"row"
                }}
            />
            );
        })}
        </div>
    );
};

export default ImageRenderer;
