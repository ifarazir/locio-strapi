export default function Checkbox(props) {

    return (
        <fieldset htmlFor={props.name} className={"flex text-white text-[16px] leading-[22px] font-medium space-x-[12px] " + props.rootClasses}>
            <input
                className={"peer h-[20px] w-[20px] border-[1px] border-[#FFFFFF] rounded-[4px] outline-none focus:outline-none " + props.inputClasses}
                name={props.name}
                id={props.name}
                type="checkbox"
            />

            <label htmlFor={props.name}>
                {props.children}
            </label>
        </fieldset>
    )

}