interface ICustomErrorProps {
    title?: string
    description?: string
}

export default function CustomError(props: ICustomErrorProps) {
    return (
        <div>
            <p>{props.title || "General Error"}</p>
            <br />
            <p>{props.description || "Something went wrong"}</p>
        </div>
    );
}