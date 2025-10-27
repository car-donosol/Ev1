export function FooterComponent() {
    return (
        <footer className="w-full">
            <div className="mx-auto px-4 mobile:px-6 mt-12 mb-6">
                <div className="flex items-center flex-col justify-center gap-2 py-6 border-t-[1.5px] border-t-[#dbdbdb] tablet:flex-row tablet:gap-4">
                    <img src="/logo.png" alt="Logo Huertabeja" className="w-[190px]" />
                    <div className="w-[3px] h-[30px] bg-[#004E09] opacity-30 hidden tablet:block"></div>
                    <p className="text-[.950rem] font-medium opacity-80 mobile:text-[1rem]">© 2026 Huertabeja</p>
                </div>
            </div>
        </footer>
    )
}