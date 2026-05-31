DELETE FROM public.products; 
DELETE FROM public.product_images; 

      WITH inserted_product AS (
        INSERT INTO public.products (name, description, price, category, stock)
        VALUES ('L''Éclipse Noire', 'A timeless chronograph.', 12500, 'Chronograph', 10)
        RETURNING id
      )
      INSERT INTO public.product_images (product_id, image_url, is_thumbnail, display_order)
      SELECT id, 'https://xtthwsdnpodjzfmnfxkj.supabase.co/storage/v1/object/public/product_images/l__clipse_noire_1780207205291.jpg', true, 0 FROM inserted_product;
    
      WITH inserted_product AS (
        INSERT INTO public.products (name, description, price, category, stock)
        VALUES ('Aura Classique', 'An elegant automatic piece.', 8900, 'Automatic', 10)
        RETURNING id
      )
      INSERT INTO public.product_images (product_id, image_url, is_thumbnail, display_order)
      SELECT id, 'https://xtthwsdnpodjzfmnfxkj.supabase.co/storage/v1/object/public/product_images/aura_classique_1780207207029.jpg', true, 0 FROM inserted_product;
    
      WITH inserted_product AS (
        INSERT INTO public.products (name, description, price, category, stock)
        VALUES ('Héritage 1924', 'A heritage masterpiece.', 15200, 'Heritage', 10)
        RETURNING id
      )
      INSERT INTO public.product_images (product_id, image_url, is_thumbnail, display_order)
      SELECT id, 'https://xtthwsdnpodjzfmnfxkj.supabase.co/storage/v1/object/public/product_images/h_ritage_1924_1780207208115.jpg', true, 0 FROM inserted_product;
    
      WITH inserted_product AS (
        INSERT INTO public.products (name, description, price, category, stock)
        VALUES ('Squelette Moderne', 'A modern tourbillon skeleton.', 42000, 'Tourbillon', 10)
        RETURNING id
      )
      INSERT INTO public.product_images (product_id, image_url, is_thumbnail, display_order)
      SELECT id, 'https://xtthwsdnpodjzfmnfxkj.supabase.co/storage/v1/object/public/product_images/squelette_moderne_1780207209530.jpg', true, 0 FROM inserted_product;
    
      WITH inserted_product AS (
        INSERT INTO public.products (name, description, price, category, stock)
        VALUES ('Sac de Nuit', 'A beautiful leather night bag.', 3800, 'Leather Goods', 10)
        RETURNING id
      )
      INSERT INTO public.product_images (product_id, image_url, is_thumbnail, display_order)
      SELECT id, 'https://xtthwsdnpodjzfmnfxkj.supabase.co/storage/v1/object/public/product_images/sac_de_nuit_1780207210839.jpg', true, 0 FROM inserted_product;
    
      WITH inserted_product AS (
        INSERT INTO public.products (name, description, price, category, stock)
        VALUES ('Le Grand Voyage', 'The grand voyage tote.', 2950, 'Tote', 10)
        RETURNING id
      )
      INSERT INTO public.product_images (product_id, image_url, is_thumbnail, display_order)
      SELECT id, 'https://xtthwsdnpodjzfmnfxkj.supabase.co/storage/v1/object/public/product_images/le_grand_voyage_1780207212137.jpg', true, 0 FROM inserted_product;
    