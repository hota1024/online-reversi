import { useEffect, useRef, useState } from 'react'
import { Board, Color, GameResult, Point, reverseColor } from 'reversi-core'
import {
  AnimationFrameRequestTicker,
  CanvasInputManager,
  CanvasRenderer,
  TextAlign,
  TinyGame,
} from 'tiny-canvas'
import { Mode } from '../types/Mode'
import { Player } from '../types/Player'
import { State } from '../types/State'

class Reversi extends TinyGame {
  state: BoardProps

  tileSize = 40

  tileRadius = this.tileSize / 2.8

  constructor(canvas: HTMLCanvasElement) {
    super(
      new CanvasRenderer(canvas),
      new CanvasInputManager(canvas),
      new AnimationFrameRequestTicker()
    )
  }

  setState(state: BoardProps) {
    this.state = state
  }

  onFrame() {
    this.fillRect(this.leftTop, this.rightBottom, '#2a922a')
    if (!this.state || !this.state.me || !this.state.enemy) {
      return
    }

    this.fillText(
      `${this.getPlayerByColor(this.state.turn).nick}'s turn`,
      this.center.x,
      48,
      'Arial',
      32,
      TextAlign.Center,
      this.state.turn
    )
    this.drawPlayerState(this.state.me, this.leftTop.x + 80, this.center.y)
    this.drawPlayerState(this.state.enemy, this.rightTop.x - 80, this.center.y)

    const boardGrid = this.state.board.toGrid()
    const points = this.state.board.getPointsToPut(this.state.turn)

    boardGrid.each((tile, { x, y }) => {
      if (tile === 'wall') {
        return
      }

      const sx = this.center.x - ((boardGrid.width + 0) * this.tileSize) / 2
      const sy = this.center.y - ((boardGrid.height + 0) * this.tileSize) / 2

      const dx = sx + x * this.tileSize
      const dy = sy + y * this.tileSize

      const cx = dx + this.tileSize / 2
      const cy = dy + this.tileSize / 2

      this.strokeRect(dx, dy, this.tileSize, this.tileSize, 'black', 2)

      if (tile === 'black' || tile === 'white') {
        this.fillCircle(cx, cy, this.tileRadius, tile)
      }

      if (this.state.lastPut) {
        if (this.state.lastPut.x === x && this.state.lastPut.y === y) {
          this.fillCircle(cx, cy, this.tileRadius / 4, 'red')
        }
      }

      if (points.find((p) => p.x === x && p.y === y)) {
        const hover =
          this.getDistance({ x: cx, y: cy }, this.cursor) <= this.tileRadius
        const alpha = hover ? 0.5 : 0.3
        const color =
          this.state.turn === 'black'
            ? `rgba(0, 0, 0, ${alpha})`
            : `rgba(255, 255, 255, ${alpha})`

        this.fillCircle(cx, cy, this.tileRadius, color)

        if (
          this.state.turn === this.state.me.color &&
          hover &&
          this.mouse.leftDown
        ) {
          this.state.onPut({ x, y })
        }
      }

      if ((x === 3 || x === 7) && (y === 3 || y === 7)) {
        this.fillCircle(dx, dy, 3, 'black')
      }
    })

    if (this.state.result) {
      this.fillRect(this.leftTop, this.rightBottom, 'rgba(0, 0, 0, 0.5)')

      if (this.state.result === 'draw') {
        this.fillText(
          'Draw!',
          this.center.x,
          this.center.y - 64,
          'Arial',
          48,
          TextAlign.Center,
          '#ffff00'
        )
        return
      }

      this.fillText(
        `${this.getPlayerByColor(this.state.result).nick} win!`,
        this.center.x,
        this.center.y - 64,
        'Arial',
        48,
        TextAlign.Center,
        '#ffff00'
      )
    }
  }

  drawPlayerState(player: Player, x: number, y: number) {
    this.drawTileCount(player.color, x, y - 16)
    this.fillText(
      player.nick,
      x,
      y + 48,
      'Arial',
      24,
      TextAlign.Center,
      player.color
    )
    this.fillText(
      `(${player === this.state.me ? 'you' : 'enemy'})`,
      x,
      y + 64 + 16,
      'Arial',
      18,
      TextAlign.Center,
      player.color
    )
  }

  drawTileCount(color: Color, x: number, y: number) {
    this.fillCircle(x, y, 32, color)
    this.fillText(
      this.state.board.count(color).toString(),
      x,
      y + 8,
      'Arial',
      26,
      TextAlign.Center,
      reverseColor(color)
    )
  }

  getPlayerByColor(color: Color) {
    return this.state.me.color === color ? this.state.me : this.state.enemy
  }

  getDistance(p0: Point, p1: Point) {
    return Math.sqrt((p0.x - p1.x) ** 2 + (p0.y - p1.y) ** 2)
  }
}

/**
 * BoardProps type.
 */
export type BoardProps = {
  board: Board

  state: State

  mode: Mode

  me: Player

  enemy: Player

  turn: Color

  result: GameResult

  lastPut: Point

  onPut(point: Point): void
}

/**
 * BoardController component.
 */
export const BoardController: React.FC<BoardProps> = (props) => {
  const canvasRef = useRef<HTMLCanvasElement>()
  const [game, setGame] = useState<Reversi>()

  useEffect(() => {
    const game = new Reversi(canvasRef.current)
    setGame(game)
    game.start()
  }, [])

  useEffect(() => {
    if (game) {
      game.setState(props)
    }
  }, [props])

  return (
    <>
      <canvas ref={canvasRef} width="640" height="480"></canvas>

      <style jsx>{`
        canvas {
          width: 640px;
          height: 480px;
          border-radius: 6px;
          box-shadow: 0 0 16px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </>
  )
}
