function getAll(node, pred) {
  let nodes = [] 

  if (!node) return nodes 

  if (pred(node)) {
      nodes.push(node) 
  }

  node = node.firstElementChild
  while (true) {
      if (!node) break 
      nodes = [...nodes, ...getAll(node, pred)] 
      node = node.nextElementSibling
  }
  return nodes 
}

const TAGS = ["YTD-COMPACT-VIDEO-RENDERER", "YTD-VIDEO-RENDERER", "YTD-RICH-ITEM-RENDERER"]

function clean(node) {
  for (let elem of getAll(node, node => TAGS.includes(node.tagName) && (
    node.querySelector(".badge-style-type-live-now") || 
    [...node.querySelectorAll(".ytd-video-meta-block")].some(v => (v.textContent || "").startsWith("Streamed")
  )
    ))) {
      elem.remove()
  }
}



function main() {
  const obs = new MutationObserver((muts, obs) => {
    for (let mut of muts) {
      for (let node of (mut.addedNodes || [])) {
        clean(node)
      }
      
    }
  }) 

  obs.observe(document.body, {childList: true, subtree: true})

  clean(document.body)
}


main()