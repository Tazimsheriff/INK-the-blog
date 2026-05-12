import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Quote, 
  Heading1, 
  Heading2, 
  Image as ImageIcon,
  Link as LinkIcon,
  Code
} from 'lucide-react';

interface TipTapEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) return null;

  const addImage = () => {
    const url = window.prompt('URL of the image:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL:', previousUrl);
    
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const buttons = [
    { icon: Bold, action: () => editor.chain().focus().toggleBold().run(), active: 'bold' },
    { icon: Italic, action: () => editor.chain().focus().toggleItalic().run(), active: 'italic' },
    { icon: Heading1, action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), active: { heading: { level: 1 } } },
    { icon: Heading2, action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: { heading: { level: 2 } } },
    { icon: List, action: () => editor.chain().focus().toggleBulletList().run(), active: 'bulletList' },
    { icon: ListOrdered, action: () => editor.chain().focus().toggleOrderedList().run(), active: 'orderedList' },
    { icon: Quote, action: () => editor.chain().focus().toggleBlockquote().run(), active: 'blockquote' },
    { icon: Code, action: () => editor.chain().focus().toggleCode().run(), active: 'code' },
    { icon: LinkIcon, action: setLink, active: 'link' },
    { icon: ImageIcon, action: addImage },
  ];

  return (
    <div className="flex flex-wrap gap-2 p-2 border-b border-black/5 bg-gray-50/50 sticky top-0 z-10 backdrop-blur-sm">
      {buttons.map((btn, i) => (
        <button
          key={i}
          onClick={(e) => {
            e.preventDefault();
            btn.action();
          }}
          className={`p-2 rounded-md transition-colors ${
            btn.active && editor.isActive(btn.active) 
              ? 'bg-black text-white' 
              : 'text-black/40 hover:bg-black/5 hover:text-black'
          }`}
        >
          <btn.icon size={18} />
        </button>
      ))}
    </div>
  );
};

export default function TipTapEditor({ content, onChange }: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder: 'Write your story...',
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[500px] p-8 font-serif',
      },
    },
  });

  return (
    <div className="bg-white border border-black/5 rounded-2xl overflow-hidden shadow-inner">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
