import {EditorView,keymap,ViewPlugin} from '@codemirror/view';
import {EditorState,StateField,StateEffect,Prec,EditorSelection} from '@codemirror/state';
import {history,historyKeymap,isolateHistory,undo,redo,defaultKeymap} from '@codemirror/commands';
import {vim,getCM} from '@replit/codemirror-vim';
const CodeMirror={EditorView,keymap,ViewPlugin,StateField,StateEffect,Prec,isolateHistory};
window.testApi={undo,redo,EditorState,EditorSelection,getCM};
window.startEditor=(useVim=false,doc='',readOnly=false)=>{
 const extensions=[];
 window.dispatchEvent(new CustomEvent('UNSTABLE_editor:extensions',{detail:{CodeMirror,CodeMirrorVim:{getCM},extensions}}));
 window.editor=new EditorView({parent:document.querySelector('#editor'),state:EditorState.create({doc,selection:{anchor:doc.length},extensions:[...(useVim?[vim()]:[]),history(),keymap.of([...historyKeymap,...defaultKeymap]),EditorState.readOnly.of(readOnly),...extensions]})});
 editor.focus();return editor;
};
