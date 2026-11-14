'use client';

import { useState, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { platforms } from '@/lib/data';
import type { Post } from '@/lib/types';
import { identifyPlatformAction, getUrlMetadataAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Link, MessageSquare, Image as ImageIcon, Rocket, Globe, MapPin, Calendar, FileText } from 'lucide-react';
import NextImage from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

interface AddContentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPostSubmit: (post: Omit<Post, 'id' | 'boomers' | 'submissions'>, collectionId?: number | null) => void;
}

const debounce = (func: (...args: any[]) => void, delay: number) => {
  let timeout: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

export default function AddContentDialog({
  open,
  onOpenChange,
  onPostSubmit,
}: AddContentDialogProps) {
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<'link' | 'location' | 'event' | 'text'>('link');

  // Link States
  const [url, setUrl] = useState('');
  const [comment, setComment] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [detectedPlatform, setDetectedPlatform] = useState<string | null>(null);
  const [isLoadingPlatform, setIsLoadingPlatform] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);

  // Location States
  const [locName, setLocName] = useState('');
  const [locAddress, setLocAddress] = useState('');
  const [locDesc, setLocDesc] = useState('');
  const [locImage, setLocImage] = useState(PlaceHolderImages[14]?.imageUrl || '');
  const [locTags, setLocTags] = useState('');

  // Event States
  const [eventTitle, setEventTitle] = useState('');
  const [eventVenue, setEventVenue] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventDesc, setEventDesc] = useState('');
  const [eventImage, setEventImage] = useState(PlaceHolderImages[3]?.imageUrl || '');
  const [eventTags, setEventTags] = useState('');

  // Text States
  const [textTitle, setTextTitle] = useState('');
  const [textBody, setTextBody] = useState('');
  const [textTags, setTextTags] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetState = () => {
    setUrl('');
    setComment('');
    setTagsInput('');
    setDetectedPlatform(null);
    setIsLoadingPlatform(false);
    setPreviewData(null);

    setLocName('');
    setLocAddress('');
    setLocDesc('');
    setLocImage(PlaceHolderImages[14]?.imageUrl || '');
    setLocTags('');

    setEventTitle('');
    setEventVenue('');
    setEventDate('');
    setEventDesc('');
    setEventImage(PlaceHolderImages[3]?.imageUrl || '');
    setEventTags('');

    setTextTitle('');
    setTextBody('');
    setTextTags('');
    
    setIsSubmitting(false);
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      resetState();
    }
    onOpenChange(isOpen);
  };

  const detectPlatform = async (targetUrl: string) => {
    if (!targetUrl.trim() || !targetUrl.startsWith('http')) {
      setDetectedPlatform(null);
      setPreviewData(null);
      return null;
    }
    
    setIsLoadingPlatform(true);
    setPreviewData(null);
    setDetectedPlatform('Detecting...');
    
    try {
      const [platformResult, metadataResult] = await Promise.all([
        identifyPlatformAction({ url: targetUrl }),
        getUrlMetadataAction({ url: targetUrl })
      ]);

      const { platform: platformId } = platformResult;
      let detected = 'web';
      let preview = null;

      if (platformId && platforms[platformId]) {
        detected = platformId;
        const { title, description, image } = metadataResult;
        const platformName = platforms[platformId]?.name || 'the website';
        const finalDescription = description || title || `An interesting link from ${platformName}.`;
        const defaultImg = PlaceHolderImages.find(i => i.id === '12');

        preview = {
          platform: platforms[platformId],
          url: targetUrl,
          image: image || defaultImg?.imageUrl,
          imageHint: 'website preview',
          title: title || `Link from ${platformName}`,
          description: finalDescription
        };
      } else {
        detected = 'web';
        const { title, description, image } = metadataResult;
        const finalDescription = description || title || `An interesting link.`;
        const defaultImg = PlaceHolderImages.find(i => i.id === '12');

        preview = {
          platform: { id: 'web', name: 'Website', category: 'web' },
          url: targetUrl,
          image: image || defaultImg?.imageUrl,
          imageHint: 'website preview',
          title: title || `External Link`,
          description: finalDescription
        };
      }

      setDetectedPlatform(detected);
      setPreviewData(preview);
      if (preview) setComment(prev => prev || preview.description);
      return { detected, preview };
    } catch (error: any) {
        console.error(error);
        setDetectedPlatform('error');
        toast({
            variant: "destructive",
            title: "Error",
            description: "Could not analyze the URL. The link may be private or incorrect.",
        });
        setPreviewData(null);
        return null;
    } finally {
        setIsLoadingPlatform(false);
    }
  };

  const detectPlatformDebounced = useCallback(
    debounce((targetUrl: string) => {
      detectPlatform(targetUrl);
    }, 700),
    []
  );

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setUrl(newUrl);
    detectPlatformDebounced(newUrl);
  };

  const handleSubmit = async () => {
    let media = '';
    let mediaHint = '';
    let platform: any = 'unknown';
    let text = '';
    let caption = '';
    let customFields: any = {};

    setIsSubmitting(true);

    if (activeTab === 'link') {
      if (!url.trim()) {
        toast({ variant: 'destructive', title: 'Cannot submit', description: 'URL is required.' });
        setIsSubmitting(false);
        return;
      }

      let activePlatform = detectedPlatform;
      let activePreview = previewData;

      if (!activePreview || activePlatform === 'Detecting...') {
        const result = await detectPlatform(url);
        if (result) {
          activePlatform = result.detected;
          activePreview = result.preview;
        }
      }

      if (!activePlatform || !activePreview || activePlatform === 'error') {
        toast({ variant: 'destructive', title: 'Cannot submit', description: 'A valid link must be detected.' });
        setIsSubmitting(false);
        return;
      }

      media = activePreview.image;
      mediaHint = activePreview.imageHint;
      platform = activePlatform;
      text = activePreview.title;
      caption = comment || activePreview.description;
      customFields = {
        type: 'link'
      };
    } else if (activeTab === 'location') {
      if (!locName.trim() || !locAddress.trim()) {
        toast({ variant: 'destructive', title: 'Cannot submit', description: 'Name and address/city are required.' });
        setIsSubmitting(false);
        return;
      }
      media = locImage;
      mediaHint = 'location spot';
      platform = 'location';
      text = locName;
      caption = locDesc || `Come check out ${locName} located at ${locAddress}.`;
      customFields = {
        address: locAddress,
        type: 'location'
      };
    } else if (activeTab === 'event') {
      if (!eventTitle.trim() || !eventVenue.trim() || !eventDate.trim()) {
        toast({ variant: 'destructive', title: 'Cannot submit', description: 'Title, venue, and event date are required.' });
        setIsSubmitting(false);
        return;
      }
      media = eventImage;
      mediaHint = 'event listing';
      platform = 'unknown';
      text = eventTitle;
      caption = eventDesc || `Join us for ${eventTitle} at ${eventVenue} on ${eventDate}!`;
      customFields = {
        venue: eventVenue,
        eventDate: eventDate,
        type: 'event'
      };
    } else if (activeTab === 'text') {
      if (!textBody.trim()) {
        toast({ variant: 'destructive', title: 'Cannot submit', description: 'Content body is required.' });
        setIsSubmitting(false);
        return;
      }
      media = '';
      mediaHint = 'text post';
      platform = 'unknown';
      text = textTitle || 'Anonymous Update';
      caption = textBody;
      customFields = {
        type: 'text'
      };
    }

    const currentTagsInput = activeTab === 'link' ? tagsInput : activeTab === 'location' ? locTags : activeTab === 'event' ? eventTags : textTags;
    const parsedTags = currentTagsInput
      .split(',')
      .map(tag => tag.trim().toLowerCase())
      .filter(tag => tag.length > 0);

    const newPost: Omit<Post, 'id' | 'boomers' | 'submissions'> & { tags?: string[]; type?: string; eventDate?: string; venue?: string; address?: string; isShoppable?: boolean; price?: string; shopHandle?: string; buyUrl?: string } = {
      media,
      mediaHint,
      platform: platform as any,
      text,
      caption,
      booms: 1,
      comments: 0,
      submitter: 'Anonymous',
      isVerified: false,
      tags: parsedTags,
      url: activeTab === 'link' ? url : `#post-${Date.now()}`,
      isNew: true,
      isBoomed: true,
      hasVideo: false,
      shares: 0,
      timestamp: new Date(),
      averageRating: 0,
      ...customFields
    };

    setTimeout(() => {
      onPostSubmit(newPost, null);
      toast({ title: 'Shared successfully!', description: 'Your recommendation is live.' });
      setIsSubmitting(false);
      handleOpenChange(false);
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto bg-white text-slate-900 border-slate-200 p-6 rounded-3xl">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-2xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
            Share Content
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500">
            Index links, coordinates, events or discussions into Sakaboom.
          </DialogDescription>
        </DialogHeader>

        {/* Custom Premium Sliding Tab Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-2xl mb-6 overflow-x-auto scrollbar-none">
          {(['link', 'location', 'event', 'text'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold transition-all capitalize shrink-0 ${
                activeTab === tab
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab === 'link' && <Link className="w-3.5 h-3.5" />}
              {tab === 'location' && <MapPin className="w-3.5 h-3.5" />}
              {tab === 'event' && <Calendar className="w-3.5 h-3.5" />}
              {tab === 'text' && <FileText className="w-3.5 h-3.5" />}
              {tab}
            </button>
          ))}
        </div>

        <div className="grid gap-5 py-2">
          {/* LINK FORM */}
          {activeTab === 'link' && (
            <>
              <div className="grid gap-1.5">
                <label htmlFor="post-url" className="font-bold text-xs uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Link className="w-3.5 h-3.5"/> Source URL
                </label>
                <Input 
                  id="post-url" 
                  value={url} 
                  onChange={handleUrlChange} 
                  onBlur={() => detectPlatform(url)}
                  placeholder="Paste a link..." 
                  className="bg-slate-50 border-slate-200 h-10 rounded-xl focus:bg-white transition-all font-medium text-slate-900"
                />
              </div>

              <div className="grid gap-1.5">
                <label htmlFor="post-tags" className="font-bold text-xs uppercase tracking-wider text-slate-500">
                  Custom Tags (comma separated)
                </label>
                <Input 
                  id="post-tags" 
                  value={tagsInput} 
                  onChange={(e) => setTagsInput(e.target.value)} 
                  placeholder="e.g. coffee, angelina-jolie, austin" 
                  className="bg-slate-50 border-slate-200 h-10 rounded-xl focus:bg-white transition-all font-medium text-slate-900"
                />
              </div>

              <div className="grid gap-1.5">
                <label className="font-bold text-xs uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5"/> Perspective
                </label>
                <Textarea 
                  value={comment} 
                  onChange={(e) => setComment(e.target.value)} 
                  placeholder="Why is this link valuable?" 
                  className="bg-slate-50 border-slate-200 min-h-[80px] rounded-xl focus:bg-white transition-all text-slate-900"
                />
              </div>

              {/* Link Preview Section */}
              <div className="relative p-4 bg-slate-50 rounded-xl border border-slate-200 min-h-[100px] flex items-center justify-center transition-all">
                {isLoadingPlatform ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Loading preview...</span>
                  </div>
                ) : previewData ? (
                  <div className="flex gap-4 w-full animate-in fade-in zoom-in duration-300">
                    <div className="w-20 h-20 relative shrink-0 bg-slate-100 rounded-lg overflow-hidden shadow-sm border border-slate-200">
                      {previewData.image ? (
                        <NextImage src={previewData.image} alt="Preview" fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                          <ImageIcon className="w-6 h-6 opacity-50" />
                        </div>
                      )}
                      <div className="absolute top-1 left-1">
                        <Badge className="bg-black/70 text-[9px] py-0 px-1 border-none text-white">
                          {previewData.platform?.name || 'Website'}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 overflow-hidden justify-center pr-2">
                      <h4 className="font-bold text-sm leading-tight text-slate-900 line-clamp-2">{previewData.title}</h4>
                      <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{previewData.description}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-1 text-slate-400">
                    <Globe className="w-6 h-6 mx-auto opacity-70" />
                    <p className="text-xs font-semibold">Preview will appear here</p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* LOCATION FORM */}
          {activeTab === 'location' && (
            <>
              <div className="grid gap-1.5">
                <label className="font-bold text-xs uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5"/> Place / Spot Name
                </label>
                <Input 
                  value={locName} 
                  onChange={(e) => setLocName(e.target.value)} 
                  placeholder="e.g. Epoch Coffee" 
                  className="bg-slate-50 border-slate-200 h-10 rounded-xl focus:bg-white transition-all font-medium text-slate-900"
                />
              </div>

              <div className="grid gap-1.5">
                <label className="font-bold text-xs uppercase tracking-wider text-slate-500">
                  Address / City
                </label>
                <Input 
                  value={locAddress} 
                  onChange={(e) => setLocAddress(e.target.value)} 
                  placeholder="e.g. Austin, TX or 221B Baker St" 
                  className="bg-slate-50 border-slate-200 h-10 rounded-xl focus:bg-white transition-all font-medium text-slate-900"
                />
              </div>

              <div className="grid gap-1.5">
                <label className="font-bold text-xs uppercase tracking-wider text-slate-500">
                  Tags (comma separated)
                </label>
                <Input 
                  value={locTags} 
                  onChange={(e) => setLocTags(e.target.value)} 
                  placeholder="e.g. cafe, work-friendly, specialty" 
                  className="bg-slate-50 border-slate-200 h-10 rounded-xl focus:bg-white transition-all font-medium text-slate-900"
                />
              </div>

              <div className="grid gap-1.5">
                <label className="font-bold text-xs uppercase tracking-wider text-slate-500">
                  Description
                </label>
                <Textarea 
                  value={locDesc} 
                  onChange={(e) => setLocDesc(e.target.value)} 
                  placeholder="Tell us what makes this location special..." 
                  className="bg-slate-50 border-slate-200 min-h-[80px] rounded-xl focus:bg-white transition-all text-slate-900"
                />
              </div>

              {/* Cover Image Selector */}
              <div className="grid gap-1.5">
                <label className="font-bold text-xs uppercase tracking-wider text-slate-500">
                  Spot Cover Image Preset
                </label>
                <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
                  {PlaceHolderImages.slice(0, 8).map((img) => (
                    <button
                      key={img.id}
                      type="button"
                      onClick={() => setLocImage(img.imageUrl)}
                      className={`relative w-16 h-12 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                        locImage === img.imageUrl ? 'border-blue-600 scale-105 shadow-sm' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <NextImage src={img.imageUrl} alt={img.imageHint} fill className="object-cover" />
                    </button>
                  ))}
                </div>
                <Input 
                  value={locImage} 
                  onChange={(e) => setLocImage(e.target.value)} 
                  placeholder="Or paste custom image URL..." 
                  className="bg-slate-50 border-slate-200 h-8 rounded-lg text-xs mt-1"
                />
              </div>
            </>
          )}

          {/* EVENT FORM */}
          {activeTab === 'event' && (
            <>
              <div className="grid gap-1.5">
                <label className="font-bold text-xs uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5"/> Event Title
                </label>
                <Input 
                  value={eventTitle} 
                  onChange={(e) => setEventTitle(e.target.value)} 
                  placeholder="e.g. Austin Jazz Festival" 
                  className="bg-slate-50 border-slate-200 h-10 rounded-xl focus:bg-white transition-all font-medium text-slate-900"
                />
              </div>

              <div className="grid gap-1.5">
                <label className="font-bold text-xs uppercase tracking-wider text-slate-500">
                  Venue / Location
                </label>
                <Input 
                  value={eventVenue} 
                  onChange={(e) => setEventVenue(e.target.value)} 
                  placeholder="e.g. Zilker Park, Austin" 
                  className="bg-slate-50 border-slate-200 h-10 rounded-xl focus:bg-white transition-all font-medium text-slate-900"
                />
              </div>

              <div className="grid gap-1.5">
                <label className="font-bold text-xs uppercase tracking-wider text-slate-500">
                  Event Date / Time
                </label>
                <Input 
                  value={eventDate} 
                  onChange={(e) => setEventDate(e.target.value)} 
                  placeholder="e.g. Sept 15, 2026 at 6:00 PM" 
                  className="bg-slate-50 border-slate-200 h-10 rounded-xl focus:bg-white transition-all font-medium text-slate-900"
                />
              </div>

              <div className="grid gap-1.5">
                <label className="font-bold text-xs uppercase tracking-wider text-slate-500">
                  Event Tags (comma separated)
                </label>
                <Input 
                  value={eventTags} 
                  onChange={(e) => setEventTags(e.target.value)} 
                  placeholder="e.g. music, festival, outdoor" 
                  className="bg-slate-50 border-slate-200 h-10 rounded-xl focus:bg-white transition-all font-medium text-slate-900"
                />
              </div>

              <div className="grid gap-1.5">
                <label className="font-bold text-xs uppercase tracking-wider text-slate-500">
                  Description
                </label>
                <Textarea 
                  value={eventDesc} 
                  onChange={(e) => setEventDesc(e.target.value)} 
                  placeholder="Details about the event, ticket links, schedule..." 
                  className="bg-slate-50 border-slate-200 min-h-[80px] rounded-xl focus:bg-white transition-all text-slate-900"
                />
              </div>

              {/* Event Cover Image Selector */}
              <div className="grid gap-1.5">
                <label className="font-bold text-xs uppercase tracking-wider text-slate-500">
                  Event Cover Image Preset
                </label>
                <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
                  {PlaceHolderImages.slice(4, 12).map((img) => (
                    <button
                      key={img.id}
                      type="button"
                      onClick={() => setEventImage(img.imageUrl)}
                      className={`relative w-16 h-12 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                        eventImage === img.imageUrl ? 'border-blue-600 scale-105 shadow-sm' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <NextImage src={img.imageUrl} alt={img.imageHint} fill className="object-cover" />
                    </button>
                  ))}
                </div>
                <Input 
                  value={eventImage} 
                  onChange={(e) => setEventImage(e.target.value)} 
                  placeholder="Or paste custom event image URL..." 
                  className="bg-slate-50 border-slate-200 h-8 rounded-lg text-xs mt-1"
                />
              </div>
            </>
          )}

          {/* TEXT POST FORM */}
          {activeTab === 'text' && (
            <>
              <div className="grid gap-1.5">
                <label className="font-bold text-xs uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5"/> Title (Optional)
                </label>
                <Input 
                  value={textTitle} 
                  onChange={(e) => setTextTitle(e.target.value)} 
                  placeholder="e.g. Recommendation wanted for local bakeries!" 
                  className="bg-slate-50 border-slate-200 h-10 rounded-xl focus:bg-white transition-all font-medium text-slate-900"
                />
              </div>

              <div className="grid gap-1.5">
                <label className="font-bold text-xs uppercase tracking-wider text-slate-500">
                  Tags (comma separated)
                </label>
                <Input 
                  value={textTags} 
                  onChange={(e) => setTextTags(e.target.value)} 
                  placeholder="e.g. ask-colombo, helper, food" 
                  className="bg-slate-50 border-slate-200 h-10 rounded-xl focus:bg-white transition-all font-medium text-slate-900"
                />
              </div>

              <div className="grid gap-1.5">
                <label className="font-bold text-xs uppercase tracking-wider text-slate-500">
                  Content Body
                </label>
                <Textarea 
                  value={textBody} 
                  onChange={(e) => setTextBody(e.target.value)} 
                  placeholder="Write your recommendation review, question or tips..." 
                  className="bg-slate-50 border-slate-200 min-h-[120px] rounded-xl focus:bg-white transition-all text-slate-900"
                />
              </div>
            </>
          )}

          <DialogFooter className="border-t border-slate-100 pt-4 mt-2">
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting || (activeTab === 'link' && (!previewData || isLoadingPlatform))}
              className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md py-5"
            >
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Rocket className="mr-2 h-4 w-4" />}
              Publish Post
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
