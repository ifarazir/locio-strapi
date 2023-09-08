export default function Input(props) {

    return (
        <fieldset htmlFor={props.name} className={"min-h-[56px] relative flex bg-neutral-100 rounded-[4px] px-[14px] py-[10px] " + props.rootClasses}>
            <input
                className={"pt-[16px] w-full bg-neutral-100 text-neutral-900 text-[16px] placeholder-neutral-400 placeholder-opacity-[0.5] outline-none focus:outline-none leading-[20px] font-medium peer " + props.inputClasses}
                name={props.name}
                id={props.name}
                type={props.type}
                placeholder={props.placeholder}
                dir={props.dir ? props.dir : "rtl"}
            />
            {/* <input type="text" id={props.name} class="block rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50 dark:bg-gray-700 border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " /> */}

            <label htmlFor={props.name} className={"cursor-pointer text-neutral-900 transition-all absolute leading-[14px] text-[12px] top-[10px] translate-y-0 opacity-50 " + props.labelClasses} >{props.title}</label>
        </fieldset>
    )

}