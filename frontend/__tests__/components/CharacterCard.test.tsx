import { render, screen, fireEvent } from "@testing-library/react"
import CharacterCard from "../../src/components/CharacterCard"
import type { Character } from "@/types/types"

describe("CharacterCard", () => {
  const mockCharacter: Character = {
    id: 1,
    name: "Rick Sanchez",
    status: "Alive",
    species: "Human",
    type: "",
    gender: "Male",
    origin: { name: "Earth (C-137)", url: "https://rickandmortyapi.com/api/location/1" },
    location: { name: "Citadel of Ricks", url: "https://rickandmortyapi.com/api/location/3" },
    image: "https://rickandmortyapi.com/api/character/avatar/1.jpeg",
    episode: ["https://rickandmortyapi.com/api/episode/1", "https://rickandmortyapi.com/api/episode/2"],
    url: "https://rickandmortyapi.com/api/character/1",
    created: "2017-11-04T18:48:46.250Z",
  }

  const defaultProps = {
    character: mockCharacter,
    isFavorite: false,
    onToggleFavorite: jest.fn(),
    onClick: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders character name", () => {
    render(<CharacterCard {...defaultProps} />)

    expect(screen.getByText("Rick Sanchez")).toBeInTheDocument()
  })

  it("renders character image", () => {
    render(<CharacterCard {...defaultProps} />)

    const image = screen.getByAltText("Rick Sanchez")
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute("src", mockCharacter.image)
  })

  it("renders character location", () => {
    render(<CharacterCard {...defaultProps} />)

    expect(screen.getByText("Citadel of Ricks")).toBeInTheDocument()
  })

  it("renders episode count", () => {
    render(<CharacterCard {...defaultProps} />)

    expect(screen.getByText("2 episodes")).toBeInTheDocument()
  })

  it("renders singular episode text for single episode", () => {
    const singleEpisodeCharacter = {
      ...mockCharacter,
      episode: ["https://rickandmortyapi.com/api/episode/1"],
    }

    render(<CharacterCard {...defaultProps} character={singleEpisodeCharacter} />)

    expect(screen.getByText("1 episode")).toBeInTheDocument()
  })

  it("shows status indicator for Alive characters", () => {
    render(<CharacterCard {...defaultProps} />)

    expect(screen.getByText("Alive")).toBeInTheDocument()
  })

  it("shows status indicator for Dead characters", () => {
    const deadCharacter = { ...mockCharacter, status: "Dead" as const }

    render(<CharacterCard {...defaultProps} character={deadCharacter} />)

    expect(screen.getByText("Dead")).toBeInTheDocument()
  })

  it("shows status indicator for unknown status", () => {
    const unknownCharacter = { ...mockCharacter, status: "unknown" as const }

    render(<CharacterCard {...defaultProps} character={unknownCharacter} />)

    expect(screen.getByText("unknown")).toBeInTheDocument()
  })

  it("calls onToggleFavorite when heart button is clicked", () => {
    const onToggleFavorite = jest.fn()

    render(<CharacterCard {...defaultProps} onToggleFavorite={onToggleFavorite} />)

    const heartButton = screen.getByRole("button")
    fireEvent.click(heartButton)

    expect(onToggleFavorite).toHaveBeenCalledWith(mockCharacter)
    expect(onToggleFavorite).toHaveBeenCalledTimes(1)
  })

  it("does not call onClick when heart button is clicked", () => {
    const onClick = jest.fn()
    const onToggleFavorite = jest.fn()

    render(<CharacterCard {...defaultProps} onClick={onClick} onToggleFavorite={onToggleFavorite} />)

    const heartButton = screen.getByRole("button")
    fireEvent.click(heartButton)

    expect(onClick).not.toHaveBeenCalled()
    expect(onToggleFavorite).toHaveBeenCalled()
  })

  it("calls onClick when card is clicked", () => {
    const onClick = jest.fn()

    render(<CharacterCard {...defaultProps} onClick={onClick} />)

    const card = screen.getByText("Rick Sanchez").closest('[class*="group"]')
    if (card) {
      fireEvent.click(card)
      expect(onClick).toHaveBeenCalledWith(mockCharacter)
    }
  })

  it("has filled heart when isFavorite is true", () => {
    render(<CharacterCard {...defaultProps} isFavorite={true} />)

    const heartButton = screen.getByRole("button")
    const svg = heartButton.querySelector("svg")

    expect(svg).toHaveClass("fill-red-500")
  })

  it("has empty heart when isFavorite is false", () => {
    render(<CharacterCard {...defaultProps} isFavorite={false} />)

    const heartButton = screen.getByRole("button")
    const svg = heartButton.querySelector("svg")

    expect(svg).not.toHaveClass("fill-red-500")
  })
})
