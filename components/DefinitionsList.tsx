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
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Definiții</h2>
            <ol className="space-y-6">
                {definitions.map((def, index) => (
                    <li key={def.id} className="space-y-2">
                        <div>
                            <span className="inline-block w-8 h-8 bg-primary-600 text-white rounded-full text-center leading-8 font-bold mr-3">
                                {index + 1}
                            </span>
                            <span className="text-gray-900 dark:text-white font-medium text-lg">
                                {def.shortDef}
                            </span>
                        </div>

                        {def.longDef && (
                            <p className="text-gray-700 dark:text-gray-300 ml-11">{def.longDef}</p>
                        )}

                        {(def.register || def.domain) && (
                            <div className="ml-11 flex gap-2">
                                {def.register && (
                                    <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">
                                        {def.register}
                                    </span>
                                )}
                                {def.domain && (
                                    <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 px-2 py-1 rounded">
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
                                        className="text-gray-600 dark:text-gray-300 italic border-l-2 border-gray-300 dark:border-gray-600 pl-3"
                                    >
                                        &ldquo;{example.text}&rdquo;
                                        {example.source === 'ai' && (
                                            <span className="text-xs text-gray-400 dark:text-gray-500 ml-2">(AI)</span>
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
