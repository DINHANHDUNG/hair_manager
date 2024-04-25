import type { RootState } from '../../app/store'
import { decrement, increment } from '../../app/features/counter/counterSlice'
import { useAppDispatch, useAppSelector } from '../../app/hooks'

export function Counter() {
  const count = useAppSelector((state: RootState) => state.counter.value)
  const dispatch = useAppDispatch()

  return (
    <div>
      <div>
        <button aria-label='Increment value' onClick={() => dispatch(increment())}>
          Increment
        </button>
        <span>{count}</span>
        <button aria-label='Decrement value' onClick={() => dispatch(decrement())}>
          Decrement
        </button>
      </div>
    </div>
  )
}
