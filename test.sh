
export SCRIPT="$(readlink -f "${BASH_SOURCE[0]}")"
export DIR="$(dirname "$SCRIPT")"
cd "$DIR"

destdir="../Obsidian/TestVault/TestVault/.obsidian/plugins"
bdir='./obsidian-local-images-continued'
npm  run  build  && \
rm -rf "$destdir"  &&  mkdir -p "$destdir" &&  \
  cp -r "$bdir""/"  "$destdir" 
