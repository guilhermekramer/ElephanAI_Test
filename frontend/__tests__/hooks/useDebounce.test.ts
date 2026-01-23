import { renderHook, act } from "@testing-library/react"
import { useDebounce } from "../../src/hooks/useDebounce"

describe("useDebounce", () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it("returns initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("initial", 300))
    expect(result.current).toBe("initial")
  })

  it("debounces value changes", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "initial", delay: 300 } }
    )

    expect(result.current).toBe("initial")

    rerender({ value: "updated", delay: 300 })
    expect(result.current).toBe("initial")

    act(() => {
      jest.advanceTimersByTime(200)
    })
    expect(result.current).toBe("initial")

    act(() => {
      jest.advanceTimersByTime(100)
    })
    expect(result.current).toBe("updated")
  })

  it("uses custom delay when provided", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "initial", delay: 500 } }
    )

    rerender({ value: "updated", delay: 500 })

    act(() => {
      jest.advanceTimersByTime(300)
    })
    expect(result.current).toBe("initial")

    act(() => {
      jest.advanceTimersByTime(200)
    })
    expect(result.current).toBe("updated")
  })

  it("uses default delay of 300ms when not provided", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value),
      { initialProps: { value: "initial" } }
    )

    rerender({ value: "updated" })

    act(() => {
      jest.advanceTimersByTime(299)
    })
    expect(result.current).toBe("initial")

    act(() => {
      jest.advanceTimersByTime(1)
    })
    expect(result.current).toBe("updated")
  })

  it("resets timer on rapid value changes", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "initial", delay: 300 } }
    )

    rerender({ value: "first", delay: 300 })

    act(() => {
      jest.advanceTimersByTime(200)
    })

    rerender({ value: "second", delay: 300 })

    act(() => {
      jest.advanceTimersByTime(200)
    })
    expect(result.current).toBe("initial")

    act(() => {
      jest.advanceTimersByTime(100)
    })
    expect(result.current).toBe("second")
  })
})
