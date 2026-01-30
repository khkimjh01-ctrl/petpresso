/**
 * PRD 문서를 화면에 표시
 */
import { prdContent } from '../content/prd'

function PrdView() {
  return (
    <section className="prd-view" aria-label="제품 요구사항 문서">
      <pre className="prd-content">{prdContent}</pre>
    </section>
  )
}

export default PrdView
