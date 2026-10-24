type MainProps = {
  fixed?: boolean
  fluid?: boolean
} & React.ComponentProps<'main'>

export function Main({ children, fixed: _fixed, fluid: _fluid, ...props }: MainProps) {
  return (
    <main
      id='content'
      className='mx-auto w-full max-w-6xl px-4 pt-4 pb-16'
      {...props}
    >
      {children}
    </main>
  )
}