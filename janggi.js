// 장기 (Janggi) - JavaScript 버전
// Python Pygame 코드를 HTML Canvas로 포팅

// ============ CONFIG (config.py) ============
const CONFIG = {
    BOARD_COLS: 9,
    BOARD_ROWS: 10,
    CELL_WIDTH: 52,
    CELL_HEIGHT: 48,
    MARGIN_LEFT: 60,
    MARGIN_TOP: 50,
    PIECE_RADIUS: 22,
    MOVE_DOT_RADIUS: 8,
    
    // 색상
    COLOR_BOARD_BG: 'rgb(218, 180, 120)',
    COLOR_LINE: 'rgb(60, 40, 20)',
    COLOR_PALACE_DIAG: 'rgb(80, 55, 30)',
    COLOR_HAN_PIECE_BG: 'rgb(200, 70, 50)',
    COLOR_HAN_PIECE_TEXT: 'rgb(255, 240, 220)',
    COLOR_CHO_PIECE_BG: 'rgb(50, 90, 140)',
    COLOR_CHO_PIECE_TEXT: 'rgb(220, 235, 255)',
    COLOR_SELECTED: 'rgb(255, 220, 0)',
    COLOR_MOVE_DOT: 'rgb(80, 80, 80)',
    COLOR_CAPTURE_HINT: 'rgb(200, 60, 60)',
    
    // 기물 한자
    PIECE_HANJA: {
        general_han: '漢',
        general_cho: '楚',
        guard: '士',
        horse: '馬',
        elephant: '象',
        chariot: '車',
        cannon: '包',
        soldier_han: '兵',
        soldier_cho: '卒',
    },
    
    // 초기 배치
    INITIAL_SETUP: [
        // Cho (row 0~3)
        [[0, 0], ['chariot', 'cho']],
        [[1, 0], ['horse', 'cho']],
        [[2, 0], ['elephant', 'cho']],
        [[3, 0], ['guard', 'cho']],
        [[5, 0], ['guard', 'cho']],
        [[6, 0], ['elephant', 'cho']],
        [[7, 0], ['horse', 'cho']],
        [[8, 0], ['chariot', 'cho']],
        [[4, 1], ['general', 'cho']],
        [[1, 2], ['cannon', 'cho']],
        [[7, 2], ['cannon', 'cho']],
        [[0, 3], ['soldier', 'cho']],
        [[2, 3], ['soldier', 'cho']],
        [[4, 3], ['soldier', 'cho']],
        [[6, 3], ['soldier', 'cho']],
        [[8, 3], ['soldier', 'cho']],
        // Han (row 6~9)
        [[0, 9], ['chariot', 'han']],
        [[1, 9], ['horse', 'han']],
        [[2, 9], ['elephant', 'han']],
        [[3, 9], ['guard', 'han']],
        [[5, 9], ['guard', 'han']],
        [[6, 9], ['elephant', 'han']],
        [[7, 9], ['horse', 'han']],
        [[8, 9], ['chariot', 'han']],
        [[4, 8], ['general', 'han']],
        [[1, 7], ['cannon', 'han']],
        [[7, 7], ['cannon', 'han']],
        [[0, 6], ['soldier', 'han']],
        [[2, 6], ['soldier', 'han']],
        [[4, 6], ['soldier', 'han']],
        [[6, 6], ['soldier', 'han']],
        [[8, 6], ['soldier', 'han']],
    ],
    
    // 궁성 대각선
    PALACE_DIAGONALS_CHO: [
        [[3, 0], [4, 1], [5, 2]],
        [[5, 0], [4, 1], [3, 2]],
    ],
    PALACE_DIAGONALS_HAN: [
        [[3, 7], [4, 8], [5, 9]],
        [[5, 7], [4, 8], [3, 9]],
    ],
};

// ============ PIECE CLASS (piece.py) ============
class Piece {
    constructor(pieceType, side, col, row) {
        this.pieceType = pieceType;  // general, guard, horse, elephant, chariot, cannon, soldier
        this.side = side;  // "han" | "cho"
        this.col = col;
        this.row = row;
        this.selected = false;
    }
    
    getHanja() {
        if (this.pieceType === 'general') {
            return this.side === 'han' ? CONFIG.PIECE_HANJA.general_han : CONFIG.PIECE_HANJA.general_cho;
        }
        if (this.pieceType === 'soldier') {
            return this.side === 'han' ? CONFIG.PIECE_HANJA.soldier_han : CONFIG.PIECE_HANJA.soldier_cho;
        }
        return CONFIG.PIECE_HANJA[this.pieceType] || '?';
    }
    
    getScreenPos() {
        const x = CONFIG.MARGIN_LEFT + this.col * CONFIG.CELL_WIDTH;
        const y = CONFIG.MARGIN_TOP + this.row * CONFIG.CELL_HEIGHT;
        return [x, y];
    }
    
    containsPoint(px, py) {
        const [cx, cy] = this.getScreenPos();
        const dx = px - cx;
        const dy = py - cy;
        return dx * dx + dy * dy <= CONFIG.PIECE_RADIUS * CONFIG.PIECE_RADIUS;
    }
    
    setPosition(col, row) {
        this.col = col;
        this.row = row;
    }
    
    draw(ctx) {
        const [cx, cy] = this.getScreenPos();
        const r = CONFIG.PIECE_RADIUS;
        
        const bgColor = this.side === 'han' ? CONFIG.COLOR_HAN_PIECE_BG : CONFIG.COLOR_CHO_PIECE_BG;
        const textColor = this.side === 'han' ? CONFIG.COLOR_HAN_PIECE_TEXT : CONFIG.COLOR_CHO_PIECE_TEXT;
        
        // 배경 원
        ctx.fillStyle = bgColor;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = CONFIG.COLOR_LINE;
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // 한자 텍스트
        ctx.fillStyle = textColor;
        ctx.font = 'bold 24px "Malgun Gothic", "맑은 고딕", "Gulim", "굴림", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.getHanja(), cx, cy);
        
        // 선택 효과
        if (this.selected) {
            ctx.strokeStyle = CONFIG.COLOR_SELECTED;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(cx, cy, r + 3, 0, Math.PI * 2);
            ctx.stroke();
        }
    }
}

// ============ MOVEMENT RULES (movement.py) ============
const Movement = {
    isInBounds(col, row) {
        return col >= 0 && col < CONFIG.BOARD_COLS && row >= 0 && row < CONFIG.BOARD_ROWS;
    },
    
    isChoPalace(col, row) {
        return [3, 4, 5].includes(col) && [0, 1, 2].includes(row);
    },
    
    isHanPalace(col, row) {
        return [3, 4, 5].includes(col) && [7, 8, 9].includes(row);
    },
    
    isInPalace(col, row, side) {
        return side === 'cho' ? this.isChoPalace(col, row) : this.isHanPalace(col, row);
    },
    
    getPalaceDiagonalLines(side) {
        return side === 'cho' ? CONFIG.PALACE_DIAGONALS_CHO : CONFIG.PALACE_DIAGONALS_HAN;
    },
    
    getPalaceOrthogonalNeighbors(col, row, side) {
        const cands = [[col + 1, row], [col - 1, row], [col, row + 1], [col, row - 1]];
        return cands.filter(([c, r]) => this.isInBounds(c, r) && this.isInPalace(c, r, side));
    },
    
    getPalaceDiagonalNeighbors(col, row, side) {
        const lines = this.getPalaceDiagonalLines(side);
        const out = [];
        for (const line of lines) {
            const idx = line.findIndex(([c, r]) => c === col && r === row);
            if (idx !== -1) {
                if (idx - 1 >= 0) out.push(line[idx - 1]);
                if (idx + 1 < line.length) out.push(line[idx + 1]);
            }
        }
        return out;
    },
    
    getPalaceAllNeighbors(col, row, side) {
        const s = new Set();
        this.getPalaceOrthogonalNeighbors(col, row, side).forEach(p => s.add(JSON.stringify(p)));
        this.getPalaceDiagonalNeighbors(col, row, side).forEach(p => s.add(JSON.stringify(p)));
        return Array.from(s).map(p => JSON.parse(p));
    },
    
    getLegalMoves(board, piece) {
        const getAt = (col, row) => board.getPieceAt(col, row);
        const side = piece.side;
        const enemy = side === 'han' ? 'cho' : 'han';
        const c = piece.col;
        const r = piece.row;
        const moves = [];
        
        const addIfOk = (col, row) => {
            if (!this.isInBounds(col, row)) return;
            const p = getAt(col, row);
            if (p === null) {
                moves.push([col, row]);
            } else if (p.side === enemy) {
                moves.push([col, row]);
            }
        };
        
        // 궁 (將)
        if (piece.pieceType === 'general') {
            this.getPalaceAllNeighbors(c, r, side).forEach(([nc, nr]) => addIfOk(nc, nr));
            return moves;
        }
        
        // 사 (士)
        if (piece.pieceType === 'guard') {
            this.getPalaceAllNeighbors(c, r, side).forEach(([nc, nr]) => addIfOk(nc, nr));
            return moves;
        }
        
        // 차 (車): 직선 + 궁성 대각선
        if (piece.pieceType === 'chariot') {
            // 가로
            for (const dc of [-1, 1]) {
                let nc = c + dc, nr = r;
                while (this.isInBounds(nc, nr)) {
                    const p = getAt(nc, nr);
                    if (p === null) {
                        moves.push([nc, nr]);
                        nc += dc;
                    } else {
                        if (p.side === enemy) moves.push([nc, nr]);
                        break;
                    }
                }
            }
            // 세로
            for (const dr of [-1, 1]) {
                let nc = c, nr = r + dr;
                while (this.isInBounds(nc, nr)) {
                    const p = getAt(nc, nr);
                    if (p === null) {
                        moves.push([nc, nr]);
                        nr += dr;
                    } else {
                        if (p.side === enemy) moves.push([nc, nr]);
                        break;
                    }
                }
            }
            // 궁성 대각선
            const allDiags = [...CONFIG.PALACE_DIAGONALS_CHO, ...CONFIG.PALACE_DIAGONALS_HAN];
            for (const diagLine of allDiags) {
                const idx = diagLine.findIndex(([dc, dr]) => dc === c && dr === r);
                if (idx === -1) continue;
                // 한 방향
                for (let i = idx - 1; i >= 0; i--) {
                    const [nc, nr] = diagLine[i];
                    const p = getAt(nc, nr);
                    if (p === null) {
                        moves.push([nc, nr]);
                    } else {
                        if (p.side === enemy) moves.push([nc, nr]);
                        break;
                    }
                }
                // 반대 방향
                for (let i = idx + 1; i < diagLine.length; i++) {
                    const [nc, nr] = diagLine[i];
                    const p = getAt(nc, nr);
                    if (p === null) {
                        moves.push([nc, nr]);
                    } else {
                        if (p.side === enemy) moves.push([nc, nr]);
                        break;
                    }
                }
            }
            return moves;
        }
        
        // 포 (包): 정확히 한 기물을 넘은 뒤, 빈 칸 모두 + 첫 적(비포) 포착
        if (piece.pieceType === 'cannon') {
            // 가로
            for (const dc of [-1, 1]) {
                let pos = c + dc;
                let hurdle = null;
                while (this.isInBounds(pos, r)) {
                    const p = getAt(pos, r);
                    if (p === null) {
                        if (hurdle !== null) moves.push([pos, r]);
                        pos += dc;
                        continue;
                    }
                    if (hurdle === null) {
                        if (p.pieceType === 'cannon') break;
                        hurdle = [pos, r];
                        pos += dc;
                        continue;
                    }
                    if (p.side === enemy && p.pieceType !== 'cannon') {
                        moves.push([pos, r]);
                    }
                    break;
                }
            }
            // 세로
            for (const dr of [-1, 1]) {
                let pos = r + dr;
                let hurdle = null;
                while (this.isInBounds(c, pos)) {
                    const p = getAt(c, pos);
                    if (p === null) {
                        if (hurdle !== null) moves.push([c, pos]);
                        pos += dr;
                        continue;
                    }
                    if (hurdle === null) {
                        if (p.pieceType === 'cannon') break;
                        hurdle = [c, pos];
                        pos += dr;
                        continue;
                    }
                    if (p.side === enemy && p.pieceType !== 'cannon') {
                        moves.push([c, pos]);
                    }
                    break;
                }
            }
            // 궁성 대각선
            const allDiags = [...CONFIG.PALACE_DIAGONALS_CHO, ...CONFIG.PALACE_DIAGONALS_HAN];
            for (const diagLine of allDiags) {
                const idx = diagLine.findIndex(([dc, dr]) => dc === c && dr === r);
                if (idx === -1 || diagLine.length !== 3) continue;
                const center = diagLine[1];
                const pc = getAt(center[0], center[1]);
                if (pc === null || pc.pieceType === 'cannon') continue;
                let targetPos = null;
                if (idx === 0) targetPos = diagLine[2];
                else if (idx === 2) targetPos = diagLine[0];
                else continue;
                const target = getAt(targetPos[0], targetPos[1]);
                if (target === null) {
                    moves.push(targetPos);
                } else if (target.side === enemy && target.pieceType !== 'cannon') {
                    moves.push(targetPos);
                }
            }
            return moves;
        }
        
        // 마 (馬): 1직선 + 1대각선, 다리 막힘
        if (piece.pieceType === 'horse') {
            const steps = [[2, 1], [2, -1], [-2, 1], [-2, -1], [1, 2], [1, -2], [-1, 2], [-1, -2]];
            const legs = [[1, 0], [1, 0], [-1, 0], [-1, 0], [0, 1], [0, -1], [0, 1], [0, -1]];
            for (let i = 0; i < steps.length; i++) {
                const [dc, dr] = steps[i];
                const [lc, lr] = legs[i];
                const legC = c + lc, legR = r + lr;
                if (!this.isInBounds(legC, legR)) continue;
                if (getAt(legC, legR) !== null) continue;
                const nc = c + dc, nr = r + dr;
                if (!this.isInBounds(nc, nr)) continue;
                const p = getAt(nc, nr);
                if (p !== null && p.side === side) continue;
                moves.push([nc, nr]);
            }
            return moves;
        }
        
        // 상 (象): 1직선 + 2대각선
        if (piece.pieceType === 'elephant') {
            const steps = [[2, 3], [2, -3], [-2, 3], [-2, -3], [3, 2], [3, -2], [-3, 2], [-3, -2]];
            const leg1 = [[0, 1], [0, -1], [0, 1], [0, -1], [1, 0], [1, 0], [-1, 0], [-1, 0]];
            const leg2Mid = [[1, 2], [1, -2], [-1, 2], [-1, -2], [1, 1], [1, -1], [-1, 1], [-1, -1]];
            for (let i = 0; i < steps.length; i++) {
                const [dc, dr] = steps[i];
                const [l1c, l1r] = leg1[i];
                const [l2c, l2r] = leg2Mid[i];
                if (!this.isInBounds(c + dc, r + dr)) continue;
                if (getAt(c + l1c, r + l1r) !== null) continue;
                if (getAt(c + l2c, r + l2r) !== null) continue;
                const nc = c + dc, nr = r + dr;
                const p = getAt(nc, nr);
                if (p !== null && p.side === side) continue;
                moves.push([nc, nr]);
            }
            return moves;
        }
        
        // 졸/병
        if (piece.pieceType === 'soldier') {
            const forwardDrs = side === 'cho' ? [1] : [-1];
            const fwdDiag = side === 'cho' ? [[1, 1], [-1, 1]] : [[1, -1], [-1, -1]];
            // 직선: 전진 1, 옆 1
            for (const [dc, dr] of [[-1, 0], [1, 0], [0, forwardDrs[0]]]) {
                addIfOk(c + dc, r + dr);
            }
            // 적 궁성 대각선에서 대각 전진
            const enemyPalaceDiags = side === 'cho' ? CONFIG.PALACE_DIAGONALS_HAN : CONFIG.PALACE_DIAGONALS_CHO;
            const allPts = enemyPalaceDiags.flat();
            const isOnDiag = allPts.some(([pc, pr]) => pc === c && pr === r);
            if (isOnDiag) {
                for (const [dc, dr] of fwdDiag) {
                    const nc = c + dc, nr = r + dr;
                    if (!this.isInBounds(nc, nr)) continue;
                    if (!allPts.some(([pc, pr]) => pc === nc && pr === nr)) continue;
                    addIfOk(nc, nr);
                }
            }
            return moves;
        }
        
        return moves;
    }
};

// ============ BOARD CLASS (board.py) ============
class Board {
    constructor() {
        this.pieces = [];
        this.currentTurn = 'cho';
        this.gameOver = null;
        this.history = [];
        this.setupInitialPieces();
    }
    
    setupInitialPieces() {
        this.pieces = [];
        for (const [[col, row], [pieceType, side]] of CONFIG.INITIAL_SETUP) {
            this.pieces.push(new Piece(pieceType, side, col, row));
        }
    }
    
    getPieceAt(col, row) {
        return this.pieces.find(p => p.col === col && p.row === row) || null;
    }
    
    getPieceAtScreen(px, py) {
        for (let i = this.pieces.length - 1; i >= 0; i--) {
            if (this.pieces[i].containsPoint(px, py)) {
                return this.pieces[i];
            }
        }
        return null;
    }
    
    screenToIntersection(px, py) {
        const halfW = CONFIG.CELL_WIDTH / 2;
        const halfH = CONFIG.CELL_HEIGHT / 2;
        const ox = px - CONFIG.MARGIN_LEFT;
        const oy = py - CONFIG.MARGIN_TOP;
        const col = Math.round(ox / CONFIG.CELL_WIDTH);
        const row = Math.round(oy / CONFIG.CELL_HEIGHT);
        if (col < 0 || col >= CONFIG.BOARD_COLS || row < 0 || row >= CONFIG.BOARD_ROWS) return null;
        const cx = col * CONFIG.CELL_WIDTH;
        const cy = row * CONFIG.CELL_HEIGHT;
        if (Math.abs(ox - cx) > halfW || Math.abs(oy - cy) > halfH) return null;
        return [col, row];
    }
    
    intersectionToScreen(col, row) {
        return [CONFIG.MARGIN_LEFT + col * CONFIG.CELL_WIDTH, CONFIG.MARGIN_TOP + row * CONFIG.CELL_HEIGHT];
    }
    
    clearSelection() {
        this.pieces.forEach(p => p.selected = false);
    }
    
    selectPiece(piece) {
        this.clearSelection();
        if (piece !== null) piece.selected = true;
    }
    
    getKing(side) {
        return this.pieces.find(p => p.pieceType === 'general' && p.side === side) || null;
    }
    
    isInCheck(side) {
        const king = this.getKing(side);
        if (!king) return false;
        const enemy = side === 'han' ? 'cho' : 'han';
        for (const p of this.pieces) {
            if (p.side !== enemy) continue;
            const moves = Movement.getLegalMoves(this, p);
            if (moves.some(([mc, mr]) => mc === king.col && mr === king.row)) {
                return true;
            }
        }
        return false;
    }
    
    getLegalMoves(piece) {
        return Movement.getLegalMoves(this, piece);
    }
    
    movePiece(piece, toCol, toRow) {
        if (this.gameOver !== null) return null;
        const target = this.getPieceAt(toCol, toRow);
        if (target !== null && target.side === piece.side) return null;
        const fromCol = piece.col, fromRow = piece.row;
        this.history.push({
            piece: piece,
            from: [fromCol, fromRow],
            to: [toCol, toRow],
            captured: target,
        });
        if (target !== null) {
            this.pieces = this.pieces.filter(p => p !== target);
        }
        piece.setPosition(toCol, toRow);
        if (target !== null && target.pieceType === 'general') {
            this.gameOver = piece.side;
        }
        return target;
    }
    
    switchTurn() {
        this.currentTurn = this.currentTurn === 'cho' ? 'han' : 'cho';
    }
    
    undo() {
        if (this.history.length === 0) return false;
        const entry = this.history.pop();
        const piece = entry.piece;
        const [fromCol, fromRow] = entry.from;
        const [toCol, toRow] = entry.to;
        const captured = entry.captured;
        piece.setPosition(fromCol, fromRow);
        if (captured !== null) {
            captured.setPosition(toCol, toRow);
            this.pieces.push(captured);
        }
        this.currentTurn = piece.side;
        if (captured !== null && captured.pieceType === 'general') {
            this.gameOver = null;
        }
        return true;
    }
    
    draw(ctx) {
        this.drawBoardLines(ctx);
        this.drawPalaceDiagonals(ctx);
        this.drawLegalMoves(ctx);
        this.pieces.forEach(p => p.draw(ctx));
    }
    
    drawBoardLines(ctx) {
        const x0 = CONFIG.MARGIN_LEFT;
        const y0 = CONFIG.MARGIN_TOP;
        ctx.strokeStyle = CONFIG.COLOR_LINE;
        ctx.lineWidth = 2;
        // 세로선
        for (let c = 0; c < CONFIG.BOARD_COLS; c++) {
            const x = x0 + c * CONFIG.CELL_WIDTH;
            ctx.beginPath();
            ctx.moveTo(x, y0);
            ctx.lineTo(x, y0 + (CONFIG.BOARD_ROWS - 1) * CONFIG.CELL_HEIGHT);
            ctx.stroke();
        }
        // 가로선
        for (let r = 0; r < CONFIG.BOARD_ROWS; r++) {
            const y = y0 + r * CONFIG.CELL_HEIGHT;
            ctx.beginPath();
            ctx.moveTo(x0, y);
            ctx.lineTo(x0 + (CONFIG.BOARD_COLS - 1) * CONFIG.CELL_WIDTH, y);
            ctx.stroke();
        }
    }
    
    drawPalaceDiagonals(ctx) {
        const x0 = CONFIG.MARGIN_LEFT;
        const y0 = CONFIG.MARGIN_TOP;
        ctx.strokeStyle = CONFIG.COLOR_PALACE_DIAG;
        ctx.lineWidth = 1;
        for (const baseRow of [0, 7]) {
            const left = x0 + 3 * CONFIG.CELL_WIDTH;
            const right = x0 + 5 * CONFIG.CELL_WIDTH;
            const top = y0 + baseRow * CONFIG.CELL_HEIGHT;
            const bottom = y0 + (baseRow + 2) * CONFIG.CELL_HEIGHT;
            ctx.beginPath();
            ctx.moveTo(left, top);
            ctx.lineTo(right, bottom);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(right, top);
            ctx.lineTo(left, bottom);
            ctx.stroke();
        }
    }
    
    drawLegalMoves(ctx) {
        const selected = this.pieces.find(p => p.selected);
        if (!selected) return;
        const moves = this.getLegalMoves(selected);
        for (const [col, row] of moves) {
            const [x, y] = this.intersectionToScreen(col, row);
            const target = this.getPieceAt(col, row);
            if (target !== null) {
                ctx.strokeStyle = CONFIG.COLOR_CAPTURE_HINT;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(x, y, CONFIG.MOVE_DOT_RADIUS + 2, 0, Math.PI * 2);
                ctx.stroke();
            } else {
                ctx.fillStyle = CONFIG.COLOR_MOVE_DOT;
                ctx.beginPath();
                ctx.arc(x, y, CONFIG.MOVE_DOT_RADIUS, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }
}

// ============ GAME LOGIC ============
let board = null;
let canvas = null;
let ctx = null;

function init() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    board = new Board();
    
    canvas.addEventListener('click', handleCanvasClick);
    document.addEventListener('keydown', handleKeyDown);
    
    render();
}

function handleCanvasClick(event) {
    if (board.gameOver !== null) return;
    
    const rect = canvas.getBoundingClientRect();
    const px = event.clientX - rect.left;
    const py = event.clientY - rect.top;
    
    const clickedPiece = board.getPieceAtScreen(px, py);
    const intersection = board.screenToIntersection(px, py);
    const selected = board.pieces.find(p => p.selected);
    
    if (selected !== null) {
        if (selected.side !== board.currentTurn) {
            board.clearSelection();
            render();
            return;
        }
        const moves = board.getLegalMoves(selected);
        const moveMatch = intersection && moves.some(([mc, mr]) => mc === intersection[0] && mr === intersection[1]);
        if (moveMatch) {
            board.movePiece(selected, intersection[0], intersection[1]);
            if (board.gameOver === null) board.switchTurn();
            board.clearSelection();
        } else if (clickedPiece !== null) {
            if (clickedPiece.side === board.currentTurn) {
                board.selectPiece(clickedPiece);
            } else {
                const captureMatch = moves.some(([mc, mr]) => mc === clickedPiece.col && mr === clickedPiece.row);
                if (captureMatch) {
                    board.movePiece(selected, clickedPiece.col, clickedPiece.row);
                    if (board.gameOver === null) board.switchTurn();
                    board.clearSelection();
                } else {
                    board.clearSelection();
                }
            }
        } else {
            board.clearSelection();
        }
    } else {
        if (clickedPiece !== null && clickedPiece.side === board.currentTurn) {
            board.selectPiece(clickedPiece);
        } else {
            board.clearSelection();
        }
    }
    
    render();
    updateUI();
}

function handleKeyDown(event) {
    if (event.key === 'u' || event.key === 'U') {
        handleUndo();
    }
}

function handleUndo() {
    if (board.undo()) {
        render();
        updateUI();
    }
}

function handleReset() {
    board = new Board();
    render();
    updateUI();
}

function render() {
    ctx.fillStyle = CONFIG.COLOR_BOARD_BG;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    board.draw(ctx);
}

function updateUI() {
    const turnInfo = document.getElementById('turnInfo');
    const checkWarning = document.getElementById('checkWarning');
    const gameOverDiv = document.getElementById('gameOver');
    const undoBtn = document.getElementById('undoBtn');
    
    undoBtn.disabled = board.history.length === 0;
    
    if (board.gameOver !== null) {
        const winner = board.gameOver === 'cho' ? '초(楚)' : '한(漢)';
        turnInfo.textContent = '';
        checkWarning.textContent = '';
        gameOverDiv.textContent = `${winner} 승리! 왕을 잡았습니다.`;
    } else {
        const turnLabel = board.currentTurn === 'cho' ? '초(楚) 차례' : '한(漢) 차례';
        turnInfo.textContent = turnLabel;
        checkWarning.textContent = board.isInCheck(board.currentTurn) ? '[ 장군! ]' : '';
        gameOverDiv.textContent = '';
    }
}

// 초기화
window.addEventListener('load', init);
