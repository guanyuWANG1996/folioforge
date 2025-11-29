import React from 'react';
import { TemplateSchema, TemplateField } from '../types';
import { Input, Textarea, Button, cn, SelectControl, ColorPicker, ImageUpload, SpotlightCard } from './ui';
import { Sparkles } from 'lucide-react';

interface SchemaFormProps {
  schema: TemplateSchema;
  data: Record<string, any>;
  onChange: (next: Record<string, any>) => void;
  sectionId?: string;
  onAiPolish?: (fieldId: string, context: 'bio' | 'project' | 'title') => void;
  optimizingFieldId?: string | null;
  isAiProcessing?: boolean;
  warningFieldId?: string | null;
}

export const SchemaForm: React.FC<SchemaFormProps> = ({ schema, data, onChange, sectionId, onAiPolish, optimizingFieldId, isAiProcessing, warningFieldId }) => {
  const aiButton = (fid: string, ctx: 'bio' | 'project' | 'title') => (
    <button 
      type="button"
      onClick={() => onAiPolish && onAiPolish(fid, ctx)}
      disabled={isAiProcessing && optimizingFieldId === fid}
      className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-primary hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isAiProcessing && optimizingFieldId === fid ? 'Thinking...' : 'AI Optimize'}
    </button>
  );

  const aiIndicator = (
    <span className="inline-flex items-center gap-1 text-primary">
      <Sparkles className="w-3 h-3" />
    </span>
  );

  const renderField = (field: TemplateField) => {
    const value = data[field.id];
    const set = (v: any) => onChange({ ...data, [field.id]: v });
    if (field.type === 'repeatable') {
      const arr = Array.isArray(value) ? value : [];
      const addItem = () => {
        const defaults = (field.items || []).reduce((acc, f) => {
          const d = f.default ?? '';
          return { ...acc, [f.id]: d };
        }, {} as any);
        set([...(arr || []), defaults]);
      };
      const removeItem = (idx: number) => {
        const next = [...arr];
        next.splice(idx, 1);
        set(next);
      };
      const setItemField = (idx: number, key: string, v: any) => {
        const next = [...arr];
        next[idx] = { ...(next[idx] || {}), [key]: v };
        set(next);
      };
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">{field.label}</span>
            <Button size="sm" onClick={addItem}>Add</Button>
          </div>
          <div className="space-y-8">
            {arr.map((item: any, idx: number) => (
              <SpotlightCard key={idx} className="p-6 bg-surface/50 border border-white/5">
                <div className="grid grid-cols-1 gap-4">
                {(field.items || []).map(sub => {
                  const subVal = item?.[sub.id] ?? '';
                  const setSub = (v: any) => setItemField(idx, sub.id, v);
                  if (sub.type === 'text') {
                    const hasAi = !!sub.aiOptimizable;
                    const ctx: 'bio' | 'project' | 'title' = sub.id === 'title' ? 'title' : 'project';
                    return (
                      <Input 
                        key={sub.id}
                        label={sub.label}
                        value={subVal}
                        onChange={(e) => setSub(e.target.value)}
                        labelAction={hasAi ? (
                          <span className="flex items-center gap-2">{aiIndicator}{aiButton(`${field.id}.${idx}.${sub.id}`, ctx)}</span>
                        ) : undefined}
                        isOptimizing={hasAi && optimizingFieldId === `${field.id}.${idx}.${sub.id}`}
                        isWarning={hasAi && warningFieldId === `${field.id}.${idx}.${sub.id}`}
                      />
                    );
                  }
                  if (sub.type === 'textarea') {
                    const hasAi = !!sub.aiOptimizable;
                    return (
                      <Textarea 
                        key={sub.id}
                        label={sub.label}
                        value={subVal}
                        onChange={(e) => setSub(e.target.value)}
                        labelAction={hasAi ? (
                          <span className="flex items-center gap-2">{aiIndicator}{aiButton(`${field.id}.${idx}.${sub.id}`, 'project')}</span>
                        ) : undefined}
                        isOptimizing={hasAi && optimizingFieldId === `${field.id}.${idx}.${sub.id}`}
                        isWarning={hasAi && warningFieldId === `${field.id}.${idx}.${sub.id}`}
                      />
                    );
                  }
                  if (sub.type === 'select') {
                    return (
                      <SelectControl 
                        key={sub.id}
                        label={sub.label}
                        labelAction={sub.aiOptimizable ? aiIndicator : undefined}
                        options={(sub.options || []).map(opt => ({ label: opt.label, value: opt.value }))}
                        value={subVal || ''}
                        onChange={(v) => setSub(v)}
                      />
                    );
                  }
                  return null;
                })}
                </div>
                <div className="flex justify-end mt-4"><Button variant="danger" size="sm" onClick={() => removeItem(idx)}>Remove</Button></div>
              </SpotlightCard>
            ))}
            {arr.length === 0 && (
              <div className="border border-dashed border-white/10 rounded-xl p-6 text-text-secondary text-sm">No items</div>
            )}
          </div>
        </div>
      );
    }
    if (field.type === 'text') {
      const hasAi = !!field.aiOptimizable;
      const ctx: 'bio' | 'project' | 'title' = field.id === 'bio' ? 'bio' : (field.id === 'title' ? 'title' : 'project');
      return (
        <Input 
          label={field.label} 
          value={value ?? ''} 
          onChange={(e) => set(e.target.value)}
          labelAction={hasAi ? (<span className="flex items-center gap-2">{aiIndicator}{aiButton(field.id, ctx)}</span>) : undefined}
          isOptimizing={hasAi && optimizingFieldId === field.id}
          isWarning={hasAi && warningFieldId === field.id}
        />
      );
    }
    if (field.type === 'textarea') {
      const ctx: 'bio' | 'project' | 'title' = field.id === 'bio' ? 'bio' : (field.id === 'title' ? 'title' : 'project');
      if (field.aiOptimizable) {
        return (
          <Textarea 
            label={field.label}
            value={value ?? ''}
            onChange={(e) => set(e.target.value)}
            labelAction={<span className="flex items-center gap-2">{aiIndicator}{aiButton(field.id, ctx)}</span>}
            isOptimizing={optimizingFieldId === field.id}
            isWarning={warningFieldId === field.id}
          />
        );
      }
      return <Textarea label={field.label} value={value ?? ''} onChange={(e) => set(e.target.value)} />;
    }
    if (field.type === 'select') {
      return (
        <SelectControl 
          label={field.label}
          labelAction={field.aiOptimizable ? aiIndicator : undefined}
          options={(field.options || []).map(opt => ({ label: opt.label, value: opt.value }))}
          value={value || ''}
          onChange={(v) => set(v)}
        />
      );
    }
    if (field.type === 'color') {
      return (
        <ColorPicker 
          label={field.label}
          labelAction={field.aiOptimizable ? aiIndicator : undefined}
          value={value || '#6366f1'}
          onChange={(v) => set(v)}
        />
      );
    }
    if (field.type === 'image') {
      return (
        <ImageUpload 
          label={field.label}
          labelAction={field.aiOptimizable ? aiIndicator : undefined}
          value={value || ''}
          onChange={(v) => set(v)}
        />
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {(sectionId ? schema.sections.filter(s => s.id === sectionId) : schema.sections).map(section => (
        <div key={section.id} className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-text-secondary">{section.label}</h3>
          <div className="space-y-6">
            {section.fields.map(f => (
              <div key={f.id}>{renderField(f)}</div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
