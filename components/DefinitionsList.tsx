import type { Definition, Example } from '@/types';

interface DefinitionsListProps {
    definitions: Definition[];
    examples: Example[];
}

export default function DefinitionsList({
    definitions,
    examples,
}: DefinitionsListProps) {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Definiții</h2>
            <ol className="space-y-6">
                {definitions.map((def, index) => (
                    <li key={def.id} className="space-y-2">
                        <div>
                            <span className="inline-block w-8 h-8 bg-primary-600 text-white rounded-full text-center leading-8 font-bold mr-3">
                                {index + 1}
                            </span>
                            <span className="text-gray-900 font-medium text-lg">
                                {def.shortDef}
                            </span>
                        </div>

                        {def.longDef && (
                            <p className="text-gray-700 ml-11">{def.longDef}</p>
                        )}

                        {(def.register || def.domain) && (
                            <div className="ml-11 flex gap-2">
                                {def.register && (
                                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                        {def.register}
                                    </span>
                                )}
                                {def.domain && (
                                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                                        {def.domain}
                                    </span>
                                )}
                            </div>
                        )}

                        {/* Related examples */}
                        <div className="ml-11 space-y-2">
                            {examples
                                .slice(index * 2, index * 2 + 2)
                                .map((example, exIdx) => (
                                    <div
                                        key={exIdx}
                                        className="text-gray-600 italic border-l-2 border-gray-300 pl-3"
                                    >
                                        &ldquo;{example.text}&rdquo;
                                        {example.source === 'ai' && (
                                            <span className="text-xs text-gray-400 ml-2">(AI)</span>
                                        )}
                                    </div>
                                ))}
                        </div>
                    </li>
                ))}
            </ol>
        </div>
    );
}
