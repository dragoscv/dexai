'use client';

import { useState } from 'react';
import type { Word } from '@/types';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface DeclensionCardProps {
    word: Word;
}

interface MoodSectionProps {
    title: string;
    isOpen: boolean;
    onToggle: () => void;
    children: React.ReactNode;
}

function MoodSection({ title, isOpen, onToggle, children }: MoodSectionProps) {
    return (
        <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden mb-3">
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between px-4 py-3 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
            >
                <span className="font-semibold text-gray-900 dark:text-white">{title}</span>
                {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                ) : (
                    <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                )}
            </button>
            {isOpen && (
                <div className="p-4 bg-white dark:bg-gray-800">
                    {children}
                </div>
            )}
        </div>
    );
}

export default function DeclensionCard({ word }: DeclensionCardProps) {
    const [openMood, setOpenMood] = useState<string>('indicativPrezent');

    const toggleMood = (mood: string) => {
        setOpenMood(openMood === mood ? '' : mood);
    };

    const renderPersonTable = (conjugation: any, tenseLabel: string) => {
        if (!conjugation) return null;

        const persons = ['eu', 'tu', 'el', 'noi', 'voi', 'ei'];
        const hasAnyPerson = persons.some(p => conjugation[p]);

        if (!hasAnyPerson) return null;

        return (
            <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600">
                    <thead>
                        <tr className="bg-green-50 dark:bg-green-900/20">
                            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left text-gray-900 dark:text-white">
                                Persoană
                            </th>
                            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left text-gray-900 dark:text-white">
                                {tenseLabel}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {conjugation.eu && (
                            <tr>
                                <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 font-medium text-gray-700 dark:text-gray-300">
                                    eu
                                </td>
                                <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-gray-900 dark:text-white">
                                    {conjugation.eu}
                                </td>
                            </tr>
                        )}
                        {conjugation.tu && (
                            <tr className="bg-gray-50 dark:bg-gray-700/30">
                                <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 font-medium text-gray-700 dark:text-gray-300">
                                    tu
                                </td>
                                <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-gray-900 dark:text-white">
                                    {conjugation.tu}
                                </td>
                            </tr>
                        )}
                        {conjugation.el && (
                            <tr>
                                <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 font-medium text-gray-700 dark:text-gray-300">
                                    el/ea
                                </td>
                                <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-gray-900 dark:text-white">
                                    {conjugation.el}
                                </td>
                            </tr>
                        )}
                        {conjugation.noi && (
                            <tr className="bg-gray-50 dark:bg-gray-700/30">
                                <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 font-medium text-gray-700 dark:text-gray-300">
                                    noi
                                </td>
                                <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-gray-900 dark:text-white">
                                    {conjugation.noi}
                                </td>
                            </tr>
                        )}
                        {conjugation.voi && (
                            <tr>
                                <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 font-medium text-gray-700 dark:text-gray-300">
                                    voi
                                </td>
                                <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-gray-900 dark:text-white">
                                    {conjugation.voi}
                                </td>
                            </tr>
                        )}
                        {conjugation.ei && (
                            <tr className="bg-gray-50 dark:bg-gray-700/30">
                                <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 font-medium text-gray-700 dark:text-gray-300">
                                    ei/ele
                                </td>
                                <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-gray-900 dark:text-white">
                                    {conjugation.ei}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        );
    };

    const hasNounForms = word.nounForms && Object.values(word.nounForms).some(v => v);
    const hasVerbForms = word.verbForms && (
        word.verbForms.infinitiv ||
        word.verbForms.indicativPrezent ||
        word.verbForms.indicativImperfect ||
        word.verbForms.indicativPerfectCompus ||
        word.verbForms.indicativPerfectSimplu ||
        word.verbForms.indicativMaiMultCaPerfect ||
        word.verbForms.indicativViitor ||
        word.verbForms.conjunctivPrezent ||
        word.verbForms.conjunctivPerfect ||
        word.verbForms.conditionalPrezent ||
        word.verbForms.conditionalPerfect ||
        word.verbForms.imperativ
    );
    const hasAdjectiveForms = word.adjectiveForms && Object.values(word.adjectiveForms).some(v => v);

    // Don't show card if no forms are available
    if (!hasNounForms && !hasVerbForms && !hasAdjectiveForms) {
        return null;
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Declinări și conjugări
            </h2>

            {/* Noun Declension Table */}
            {hasNounForms && word.nounForms && (
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 mb-3">
                        Declinarea substantivului
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-indigo-50 dark:bg-indigo-950/30">
                                    <th className="border border-indigo-200 dark:border-indigo-800 px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Caz
                                    </th>
                                    <th className="border border-indigo-200 dark:border-indigo-800 px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Singular
                                    </th>
                                    <th className="border border-indigo-200 dark:border-indigo-800 px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Plural
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-medium text-gray-700 dark:text-gray-300">
                                        Nominativ-Acuzativ
                                    </td>
                                    <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">
                                        <div className="space-y-1">
                                            {word.nounForms.singularIndefinit && (
                                                <div className="text-gray-600 dark:text-gray-400 text-sm">
                                                    Nearticulat: <span className="font-semibold text-gray-900 dark:text-white">{word.nounForms.singularIndefinit}</span>
                                                </div>
                                            )}
                                            {word.nounForms.singularDefinit && (
                                                <div className="text-gray-600 dark:text-gray-400 text-sm">
                                                    Articulat: <span className="font-semibold text-gray-900 dark:text-white">{word.nounForms.singularDefinit}</span>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">
                                        <div className="space-y-1">
                                            {word.nounForms.pluralIndefinit && (
                                                <div className="text-gray-600 dark:text-gray-400 text-sm">
                                                    Nearticulat: <span className="font-semibold text-gray-900 dark:text-white">{word.nounForms.pluralIndefinit}</span>
                                                </div>
                                            )}
                                            {word.nounForms.pluralDefinit && (
                                                <div className="text-gray-600 dark:text-gray-400 text-sm">
                                                    Articulat: <span className="font-semibold text-gray-900 dark:text-white">{word.nounForms.pluralDefinit}</span>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                                {(word.nounForms.genitivDativSingular || word.nounForms.genitivDativPlural) && (
                                    <tr>
                                        <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-medium text-gray-700 dark:text-gray-300">
                                            Genitiv-Dativ
                                        </td>
                                        <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">
                                            {word.nounForms.genitivDativSingular && (
                                                <span className="font-semibold text-gray-900 dark:text-white">{word.nounForms.genitivDativSingular}</span>
                                            )}
                                        </td>
                                        <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">
                                            {word.nounForms.genitivDativPlural && (
                                                <span className="font-semibold text-gray-900 dark:text-white">{word.nounForms.genitivDativPlural}</span>
                                            )}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Comprehensive Verb Conjugation with Accordion */}
            {hasVerbForms && word.verbForms && (
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-green-600 dark:text-green-400 mb-3">
                        Conjugarea verbului
                    </h3>

                    {/* Nepersonale Forms */}
                    {(word.verbForms.infinitiv || word.verbForms.participiu || word.verbForms.gerunziu || word.verbForms.supin) && (
                        <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-gray-300 dark:border-gray-600">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                                Forme Nepersonale
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                {word.verbForms.infinitiv && (
                                    <div className="text-gray-700 dark:text-gray-300">
                                        <span className="font-medium">Infinitiv:</span> {word.verbForms.infinitiv}
                                    </div>
                                )}
                                {word.verbForms.participiu && (
                                    <div className="text-gray-700 dark:text-gray-300">
                                        <span className="font-medium">Participiu:</span> {word.verbForms.participiu}
                                    </div>
                                )}
                                {word.verbForms.gerunziu && (
                                    <div className="text-gray-700 dark:text-gray-300">
                                        <span className="font-medium">Gerunziu:</span> {word.verbForms.gerunziu}
                                    </div>
                                )}
                                {word.verbForms.supin && (
                                    <div className="text-gray-700 dark:text-gray-300">
                                        <span className="font-medium">Supin:</span> {word.verbForms.supin}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* MODUL INDICATIV */}
                    {(word.verbForms.indicativPrezent || word.verbForms.indicativImperfect ||
                        word.verbForms.indicativPerfectSimplu || word.verbForms.indicativPerfectCompus ||
                        word.verbForms.indicativMaiMultCaPerfect || word.verbForms.indicativViitor) && (
                            <div className="mb-4">
                                <h4 className="font-semibold text-base text-gray-900 dark:text-white mb-3">
                                    Modul Indicativ
                                </h4>

                                {word.verbForms.indicativPrezent && (
                                    <MoodSection
                                        title="Prezent"
                                        isOpen={openMood === 'indicativPrezent'}
                                        onToggle={() => toggleMood('indicativPrezent')}
                                    >
                                        {renderPersonTable(word.verbForms.indicativPrezent, 'Prezent')}
                                    </MoodSection>
                                )}

                                {word.verbForms.indicativImperfect && (
                                    <MoodSection
                                        title="Imperfect"
                                        isOpen={openMood === 'indicativImperfect'}
                                        onToggle={() => toggleMood('indicativImperfect')}
                                    >
                                        {renderPersonTable(word.verbForms.indicativImperfect, 'Imperfect')}
                                    </MoodSection>
                                )}

                                {word.verbForms.indicativPerfectSimplu && (
                                    <MoodSection
                                        title="Perfect Simplu"
                                        isOpen={openMood === 'indicativPerfectSimplu'}
                                        onToggle={() => toggleMood('indicativPerfectSimplu')}
                                    >
                                        {renderPersonTable(word.verbForms.indicativPerfectSimplu, 'Perfect Simplu')}
                                    </MoodSection>
                                )}

                                {word.verbForms.indicativPerfectCompus && (
                                    <MoodSection
                                        title="Perfect Compus"
                                        isOpen={openMood === 'indicativPerfectCompus'}
                                        onToggle={() => toggleMood('indicativPerfectCompus')}
                                    >
                                        {renderPersonTable(word.verbForms.indicativPerfectCompus, 'Perfect Compus')}
                                    </MoodSection>
                                )}

                                {word.verbForms.indicativMaiMultCaPerfect && (
                                    <MoodSection
                                        title="Mai Mult Ca Perfect"
                                        isOpen={openMood === 'indicativMaiMultCaPerfect'}
                                        onToggle={() => toggleMood('indicativMaiMultCaPerfect')}
                                    >
                                        {renderPersonTable(word.verbForms.indicativMaiMultCaPerfect, 'Mai Mult Ca Perfect')}
                                    </MoodSection>
                                )}

                                {word.verbForms.indicativViitor && (
                                    <MoodSection
                                        title="Viitor"
                                        isOpen={openMood === 'indicativViitor'}
                                        onToggle={() => toggleMood('indicativViitor')}
                                    >
                                        {renderPersonTable(word.verbForms.indicativViitor, 'Viitor')}
                                    </MoodSection>
                                )}
                            </div>
                        )}

                    {/* MODUL CONJUNCTIV */}
                    {(word.verbForms.conjunctivPrezent || word.verbForms.conjunctivPerfect) && (
                        <div className="mb-4">
                            <h4 className="font-semibold text-base text-gray-900 dark:text-white mb-3">
                                Modul Conjunctiv
                            </h4>

                            {word.verbForms.conjunctivPrezent && (
                                <MoodSection
                                    title="Prezent"
                                    isOpen={openMood === 'conjunctivPrezent'}
                                    onToggle={() => toggleMood('conjunctivPrezent')}
                                >
                                    {renderPersonTable(word.verbForms.conjunctivPrezent, 'Conjunctiv Prezent')}
                                </MoodSection>
                            )}

                            {word.verbForms.conjunctivPerfect && (
                                <MoodSection
                                    title="Perfect"
                                    isOpen={openMood === 'conjunctivPerfect'}
                                    onToggle={() => toggleMood('conjunctivPerfect')}
                                >
                                    {renderPersonTable(word.verbForms.conjunctivPerfect, 'Conjunctiv Perfect')}
                                </MoodSection>
                            )}
                        </div>
                    )}

                    {/* MODUL CONDITIONAL */}
                    {(word.verbForms.conditionalPrezent || word.verbForms.conditionalPerfect) && (
                        <div className="mb-4">
                            <h4 className="font-semibold text-base text-gray-900 dark:text-white mb-3">
                                Modul Conditional
                            </h4>

                            {word.verbForms.conditionalPrezent && (
                                <MoodSection
                                    title="Prezent"
                                    isOpen={openMood === 'conditionalPrezent'}
                                    onToggle={() => toggleMood('conditionalPrezent')}
                                >
                                    {renderPersonTable(word.verbForms.conditionalPrezent, 'Conditional Prezent')}
                                </MoodSection>
                            )}

                            {word.verbForms.conditionalPerfect && (
                                <MoodSection
                                    title="Perfect"
                                    isOpen={openMood === 'conditionalPerfect'}
                                    onToggle={() => toggleMood('conditionalPerfect')}
                                >
                                    {renderPersonTable(word.verbForms.conditionalPerfect, 'Conditional Perfect')}
                                </MoodSection>
                            )}
                        </div>
                    )}

                    {/* MODUL IMPERATIV */}
                    {word.verbForms.imperativ && (word.verbForms.imperativ.tu || word.verbForms.imperativ.voi) && (
                        <div className="mb-4">
                            <h4 className="font-semibold text-base text-gray-900 dark:text-white mb-3">
                                Modul Imperativ
                            </h4>

                            <MoodSection
                                title="Imperativ"
                                isOpen={openMood === 'imperativ'}
                                onToggle={() => toggleMood('imperativ')}
                            >
                                <div className="overflow-x-auto">
                                    <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600">
                                        <thead>
                                            <tr className="bg-green-50 dark:bg-green-900/20">
                                                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left text-gray-900 dark:text-white">
                                                    Persoană
                                                </th>
                                                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left text-gray-900 dark:text-white">
                                                    Imperativ
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {word.verbForms.imperativ.tu && (
                                                <tr>
                                                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 font-medium text-gray-700 dark:text-gray-300">
                                                        tu
                                                    </td>
                                                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-gray-900 dark:text-white">
                                                        {word.verbForms.imperativ.tu}
                                                    </td>
                                                </tr>
                                            )}
                                            {word.verbForms.imperativ.voi && (
                                                <tr className="bg-gray-50 dark:bg-gray-700/30">
                                                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 font-medium text-gray-700 dark:text-gray-300">
                                                        voi
                                                    </td>
                                                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-gray-900 dark:text-white">
                                                        {word.verbForms.imperativ.voi}
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </MoodSection>
                        </div>
                    )}
                </div>
            )}

            {/* Adjective Forms Table */}
            {hasAdjectiveForms && word.adjectiveForms && (
                <div>
                    <h3 className="text-lg font-semibold text-purple-600 dark:text-purple-400 mb-3">
                        Formele adjectivului
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-purple-50 dark:bg-purple-950/30">
                                    <th className="border border-purple-200 dark:border-purple-800 px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Gen / Număr
                                    </th>
                                    <th className="border border-purple-200 dark:border-purple-800 px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Formă
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {word.adjectiveForms.masculinSingular && (
                                    <tr>
                                        <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-medium text-gray-700 dark:text-gray-300">
                                            Masculin singular
                                        </td>
                                        <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-semibold text-gray-900 dark:text-white">
                                            {word.adjectiveForms.masculinSingular}
                                        </td>
                                    </tr>
                                )}
                                {word.adjectiveForms.femininSingular && (
                                    <tr>
                                        <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-medium text-gray-700 dark:text-gray-300">
                                            Feminin singular
                                        </td>
                                        <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-semibold text-gray-900 dark:text-white">
                                            {word.adjectiveForms.femininSingular}
                                        </td>
                                    </tr>
                                )}
                                {word.adjectiveForms.neutruSingular && (
                                    <tr>
                                        <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-medium text-gray-700 dark:text-gray-300">
                                            Neutru singular
                                        </td>
                                        <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-semibold text-gray-900 dark:text-white">
                                            {word.adjectiveForms.neutruSingular}
                                        </td>
                                    </tr>
                                )}
                                {word.adjectiveForms.plural && (
                                    <tr>
                                        <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-medium text-gray-700 dark:text-gray-300">
                                            Plural
                                        </td>
                                        <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-semibold text-gray-900 dark:text-white">
                                            {word.adjectiveForms.plural}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-100 dark:border-blue-800/50">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                    <span className="font-semibold">ℹ️ Notă:</span> Formele gramaticale sunt generate automat de AI și pot conține erori pentru cuvinte neregulate.
                </p>
            </div>
        </div>
    );
}
